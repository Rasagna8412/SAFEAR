import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CertificateService } from '../services/certificate/certificateService';
import { FirestoreCertificateRepository } from '../services/repositories/certificateRepository';
import { HardhatCertificateRegistry } from '../services/blockchain/HardhatCertificateRegistry';
import { canonicalizeCertificate, computeCertificateHash } from '../services/blockchain/canonicalHash';
import { CanonicalCertificatePayload } from '../types/certificate';
import { TrainingResultRecord } from '../services/repositories/trainingResultRepository';

describe('Phase 7 Blockchain Certificate Issuance, Hashing & Verification Tests', () => {
  let certService: CertificateService;
  let certRepo: FirestoreCertificateRepository;
  let blockchain: HardhatCertificateRegistry;

  beforeEach(() => {
    certRepo = new FirestoreCertificateRepository();
    blockchain = new HardhatCertificateRegistry();
    certService = new CertificateService(certRepo, blockchain);
  });

  describe('1. Canonical Serialization & Hash Determinism', () => {
    it('1. Canonical serialization must produce identical string regardless of key insertion order', () => {
      const payloadA: CanonicalCertificatePayload = {
        certificateId: 'SAFEAR-2026-000001',
        courseId: 'mining-safety-01',
        courseTitle: 'Mining Safety Level 1',
        durationSeconds: 300,
        emergencyScore: 100,
        hazardScore: 100,
        issuedAt: '2026-08-25T12:00:00Z',
        passed: true,
        ppeScore: 100,
        procedureScore: 100,
        score: 95,
        userId: 'usr_worker_01',
        workerName: 'Alex Chen'
      };

      const payloadB: CanonicalCertificatePayload = {
        workerName: 'Alex Chen',
        userId: 'usr_worker_01',
        score: 95,
        procedureScore: 100,
        ppeScore: 100,
        passed: true,
        issuedAt: '2026-08-25T12:00:00Z',
        hazardScore: 100,
        emergencyScore: 100,
        durationSeconds: 300,
        courseTitle: 'Mining Safety Level 1',
        courseId: 'mining-safety-01',
        certificateId: 'SAFEAR-2026-000001'
      };

      const canonicalA = canonicalizeCertificate(payloadA);
      const canonicalB = canonicalizeCertificate(payloadB);
      expect(canonicalA).toBe(canonicalB);

      const hashA = computeCertificateHash(payloadA);
      const hashB = computeCertificateHash(payloadB);
      expect(hashA).toBe(hashB);
      expect(hashA).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe('2. Eligibility & Duplicate Protection', () => {
    it('2. isEligible must approve score >= 70 and reject score < 70', () => {
      expect(certService.isEligible({ passed: true, score: 70 })).toBe(true);
      expect(certService.isEligible({ passed: true, score: 95 })).toBe(true);
      expect(certService.isEligible({ passed: false, score: 65 })).toBe(false);
      expect(certService.isEligible({ passed: true, score: 60 })).toBe(false);
    });

    it('3. Ineligible training result must throw error when attempting issuance', async () => {
      const ineligibleResult: TrainingResultRecord = {
        resultId: 'res_fail_01',
        sessionId: 'trn_fail_01',
        userId: 'usr_worker_01',
        scenarioId: 'mining-basic-scene',
        score: 55,
        passed: false,
        correctActions: 3,
        incorrectActions: 3,
        unsafeActions: 1,
        skippedSteps: 0,
        penalties: 45,
        completedAt: new Date().toISOString()
      };

      await expect(
        certService.issueCertificate(ineligibleResult, {
          recipientName: 'Alex Chen',
          courseName: 'Mining Safety'
        })
      ).rejects.toThrow(/70% passing threshold/);
    });

    it('4. Duplicate issuance must return existing certificate without duplicate blockchain transactions', async () => {
      const validResult: TrainingResultRecord = {
        resultId: 'res_pass_01',
        sessionId: 'trn_pass_01',
        userId: 'usr_worker_01',
        scenarioId: 'mining-basic-scene',
        score: 90,
        passed: true,
        correctActions: 6,
        incorrectActions: 0,
        unsafeActions: 0,
        skippedSteps: 0,
        penalties: 0,
        completedAt: new Date().toISOString()
      };

      const spyBlockchain = vi.spyOn(blockchain, 'registerCertificate');

      // First issuance
      const { certificate: cert1, isExisting: isExisting1 } = await certService.issueCertificate(validResult, {
        recipientName: 'Alex Chen',
        courseName: 'Mining Safety Level 1'
      });
      expect(isExisting1).toBe(false);
      expect(cert1.status).toBe('ISSUED');
      expect(spyBlockchain).toHaveBeenCalledTimes(1);

      // Second issuance for same result
      const { certificate: cert2, isExisting: isExisting2 } = await certService.issueCertificate(validResult, {
        recipientName: 'Alex Chen',
        courseName: 'Mining Safety Level 1'
      });
      expect(isExisting2).toBe(true);
      expect(cert2.certificateId).toBe(cert1.certificateId);
      // Blockchain register should NOT have been called a second time
      expect(spyBlockchain).toHaveBeenCalledTimes(1);
    });
  });

  describe('3. On-Chain & Public Verification', () => {
    it('5. Verifying an existing certificate should return VALID status and on-chain record', async () => {
      const validResult: TrainingResultRecord = {
        resultId: 'res_pass_02',
        sessionId: 'trn_pass_02',
        userId: 'usr_worker_02',
        scenarioId: 'mining-basic-scene',
        score: 100,
        passed: true,
        correctActions: 6,
        incorrectActions: 0,
        unsafeActions: 0,
        skippedSteps: 0,
        penalties: 0,
        completedAt: new Date().toISOString()
      };

      const { certificate } = await certService.issueCertificate(validResult, {
        recipientName: 'Sarah Jenkins',
        courseName: 'Mining Safety Level 1'
      });

      const verification = await certService.verifyCertificate(certificate.certificateId);
      expect(verification.status).toBe('VALID');
      expect(verification.certificate?.recipientName).toBe('Sarah Jenkins');
      expect(verification.onChainRecord?.exists).toBe(true);
    });

    it('6. Verifying non-existent certificate ID should return NOT_FOUND', async () => {
      const verification = await certService.verifyCertificate('SAFEAR-2026-999999');
      expect(verification.status).toBe('NOT_FOUND');
    });
  });
});

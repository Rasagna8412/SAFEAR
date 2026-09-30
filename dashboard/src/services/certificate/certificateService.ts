import {
  CertificateRecord,
  VerificationResult,
  CanonicalCertificatePayload
} from '../../types/certificate';
import { computeCertificateHash } from '../blockchain/canonicalHash';
import { blockchainRegistry, IBlockchainCertificateRegistry } from '../blockchain/HardhatCertificateRegistry';
import { certificateRepository, ICertificateRepository } from '../repositories/certificateRepository';
import { TrainingResultRecord } from '../repositories/trainingResultRepository';

export class CertificateService {
  private repo: ICertificateRepository;
  private blockchain: IBlockchainCertificateRegistry;

  constructor(repo?: ICertificateRepository, blockchain?: IBlockchainCertificateRegistry) {
    this.repo = repo || certificateRepository;
    this.blockchain = blockchain || blockchainRegistry;
  }

  public isEligible(result: Partial<TrainingResultRecord> | { passed?: boolean; score?: number }): boolean {
    const passed = result.passed ?? false;
    const score = result.score ?? 0;
    return passed && score >= 70;
  }

  public async issueCertificate(
    result: TrainingResultRecord,
    options: {
      recipientName: string;
      courseName: string;
      courseId?: string;
      scenarioId?: string;
    }
  ): Promise<{ certificate: CertificateRecord; isExisting: boolean }> {
    if (!this.isEligible(result)) {
      throw new Error('Training result does not meet the minimum 70% passing threshold for certification.');
    }

    // 1. Check duplicate issuance
    const existing = await this.repo.getCertificateByResultId(result.resultId);
    if (existing) {
      return { certificate: existing, isExisting: true };
    }

    const certificateId = `SAFEAR-2026-${Date.now().toString().slice(-6)}`;
    const issuedAt = new Date().toISOString();

    const canonicalPayload: CanonicalCertificatePayload = {
      certificateId,
      courseId: options.courseId || result.scenarioId || 'mining-safety-01',
      courseTitle: options.courseName,
      durationSeconds: 300,
      emergencyScore: 100,
      hazardScore: 100,
      issuedAt,
      passed: true,
      ppeScore: 100,
      procedureScore: 100,
      score: result.score,
      userId: result.userId,
      workerName: options.recipientName
    };

    // 2. Compute deterministic SHA-256 hash
    const certificateHash = computeCertificateHash(canonicalPayload);

    // 3. Register on-chain with smart contract
    const blockchainRes = await this.blockchain.registerCertificate(certificateHash, certificateId);

    const record: CertificateRecord = {
      certificateId,
      userId: result.userId,
      trainingResultId: result.resultId,
      scenarioId: options.scenarioId || result.scenarioId,
      courseId: options.courseId || 'mining-safety-01',
      recipientName: options.recipientName,
      courseName: options.courseName,
      score: result.score,
      issuedAt,
      certificateHash,
      blockchainTransactionHash: blockchainRes.txHash,
      blockchainCertificateId: certificateId,
      verificationUrl: `/verify/${certificateId}`,
      status: 'ISSUED'
    };

    // 4. Persist to Firestore
    await this.repo.saveCertificate(record);

    return { certificate: record, isExisting: false };
  }

  public async verifyCertificate(certificateId: string): Promise<VerificationResult> {
    const cert = await this.repo.getCertificateById(certificateId);
    if (!cert) {
      return {
        status: 'NOT_FOUND',
        verifiedAt: new Date().toISOString(),
        message: 'Certificate ID not found in SafeAR registry.'
      };
    }

    if (cert.status === 'REVOKED') {
      return {
        status: 'REVOKED',
        certificate: cert,
        verifiedAt: new Date().toISOString(),
        message: 'Certificate has been revoked by administration.'
      };
    }

    // Verify on-chain registration
    const onChain = await this.blockchain.verifyCertificate(cert.certificateHash);

    if (!onChain.exists) {
      return {
        status: 'INVALID',
        certificate: cert,
        onChainRecord: onChain,
        verifiedAt: new Date().toISOString(),
        message: 'Certificate hash is not registered on the Ethereum blockchain.'
      };
    }

    return {
      status: 'VALID',
      certificate: cert,
      onChainRecord: onChain,
      verifiedAt: new Date().toISOString(),
      message: 'Certificate successfully verified on-chain against CertificateRegistry.sol.'
    };
  }
}

export const certificateService = new CertificateService();

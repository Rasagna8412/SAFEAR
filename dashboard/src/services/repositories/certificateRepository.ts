import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { CertificateRecord } from '../../types/certificate';

export interface ICertificateRepository {
  saveCertificate(cert: CertificateRecord): Promise<void>;
  getCertificateById(certificateId: string): Promise<CertificateRecord | null>;
  getCertificateByResultId(resultId: string): Promise<CertificateRecord | null>;
  getUserCertificates(userId: string): Promise<CertificateRecord[]>;
}

// Pre-seeded Demo Certificate for instant Blockchain & Cybersecurity demonstration
export const DEMO_CERTIFICATE: CertificateRecord = {
  certificateId: 'SAFEAR-2026-DEMO01',
  userId: 'usr_demo_worker_01',
  trainingResultId: 'res_demo_session_01',
  scenarioId: 'mining-basic-scene',
  courseId: 'mining-safety-01',
  recipientName: 'Rasagna',
  courseName: 'Mining Safety Level 1 — Excavation Chamber Scenario',
  score: 95,
  issuedAt: '2026-08-28T18:30:00.000Z',
  certificateHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  blockchainTransactionHash: '0x9a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
  blockchainCertificateId: 'SAFEAR-2026-DEMO01',
  verificationUrl: '/verify/SAFEAR-2026-DEMO01',
  status: 'ISSUED'
};

const localCertificatesCache = new Map<string, CertificateRecord>([
  [DEMO_CERTIFICATE.certificateId, DEMO_CERTIFICATE]
]);

export class FirestoreCertificateRepository implements ICertificateRepository {
  public async saveCertificate(cert: CertificateRecord): Promise<void> {
    localCertificatesCache.set(cert.certificateId, cert);

    try {
      const certRef = doc(db, 'certificates', cert.certificateId);
      const writePromise = setDoc(certRef, {
        ...cert,
        createdAt: serverTimestamp()
      }, { merge: true });

      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timeout')), 1000)
      );

      await Promise.race([writePromise, timeoutPromise]);
    } catch {
      // Local fallback
    }
  }

  public async getCertificateById(certificateId: string): Promise<CertificateRecord | null> {
    try {
      const snap = await getDoc(doc(db, 'certificates', certificateId));
      if (snap.exists()) {
        return snap.data() as CertificateRecord;
      }
    } catch {
      // Fallback
    }
    return localCertificatesCache.get(certificateId) || null;
  }

  public async getCertificateByResultId(resultId: string): Promise<CertificateRecord | null> {
    try {
      const q = query(collection(db, 'certificates'), where('trainingResultId', '==', resultId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as CertificateRecord;
      }
    } catch {
      // Fallback
    }
    for (const cert of localCertificatesCache.values()) {
      if (cert.trainingResultId === resultId) return cert;
    }
    return null;
  }

  public async getUserCertificates(userId: string): Promise<CertificateRecord[]> {
    try {
      const q = query(collection(db, 'certificates'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => d.data() as CertificateRecord);
      }
    } catch {
      // Fallback
    }
    return Array.from(localCertificatesCache.values()).filter(c => c.userId === userId);
  }
}

export const certificateRepository: ICertificateRepository = new FirestoreCertificateRepository();

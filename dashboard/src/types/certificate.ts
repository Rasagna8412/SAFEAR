export type CertificateStatus =
  | 'ELIGIBLE'
  | 'GENERATING'
  | 'REGISTERING'
  | 'ISSUED'
  | 'FAILED'
  | 'REVOKED';

export interface CertificateRecord {
  certificateId: string;
  userId: string;
  trainingResultId: string;
  scenarioId: string;
  courseId: string;
  recipientName: string;
  courseName: string;
  score: number;
  issuedAt: string;
  certificateHash: string;
  blockchainTransactionHash: string;
  blockchainCertificateId: string;
  verificationUrl: string;
  status: CertificateStatus;
}

export interface OnChainRecord {
  exists: boolean;
  certificateId: string;
  registeredAt: number; // Unix timestamp in seconds
  issuer: string;
}

export interface VerificationResult {
  status: 'VALID' | 'INVALID' | 'NOT_FOUND' | 'REVOKED';
  certificate?: CertificateRecord;
  onChainRecord?: OnChainRecord;
  verifiedAt: string;
  message: string;
}

export interface CanonicalCertificatePayload {
  certificateId: string;
  courseId: string;
  courseTitle: string;
  durationSeconds: number;
  emergencyScore: number;
  hazardScore: number;
  issuedAt: string;
  passed: boolean;
  ppeScore: number;
  procedureScore: number;
  score: number;
  userId: string;
  workerName: string;
}

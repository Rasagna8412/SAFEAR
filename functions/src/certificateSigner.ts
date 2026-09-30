import * as crypto from "crypto";

export interface CertificateCanonicalData {
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

/**
 * Produces a canonical sorted JSON string representation of a certificate.
 */
export function canonicalizeCertificate(data: CertificateCanonicalData): string {
  const sortedKeys = Object.keys(data).sort() as (keyof CertificateCanonicalData)[];
  const sortedObj: Record<string, any> = {};
  for (const key of sortedKeys) {
    sortedObj[key] = data[key];
  }
  return JSON.stringify(sortedObj);
}

/**
 * Computes deterministic SHA-256 hash of canonical certificate data.
 */
export function computeCertificateHash(data: CertificateCanonicalData): string {
  const canonicalJson = canonicalizeCertificate(data);
  return "0x" + crypto.createHash("sha256").update(canonicalJson, "utf8").digest("hex");
}

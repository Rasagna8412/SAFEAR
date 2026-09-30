import { sha256, toUtf8Bytes } from 'ethers';
import { CanonicalCertificatePayload } from '../../types/certificate';

const AUTH_SALT = 'SAFEAR_INDUSTRIAL_SALT_2026_JHARKHAND';

/**
 * Produces a canonical sorted JSON string representation of a certificate payload.
 * Guarantees 100% deterministic property order regardless of environment.
 */
export function canonicalizeCertificate(data: CanonicalCertificatePayload): string {
  const sortedKeys = (Object.keys(data) as (keyof CanonicalCertificatePayload)[]).sort();
  const sortedObj: Record<string, any> = {};
  for (const key of sortedKeys) {
    sortedObj[key] = data[key];
  }
  return JSON.stringify(sortedObj);
}

/**
 * Computes deterministic 0x-prefixed SHA-256 hash (bytes32 format) for Ethereum smart contract registration.
 */
export function computeCertificateHash(data: CanonicalCertificatePayload): string {
  const canonicalJson = canonicalizeCertificate(data);
  return sha256(toUtf8Bytes(canonicalJson));
}

/**
 * Secure NIST SHA-256 cryptographic password hashing with industrial salt.
 * Ensures no plain-text passwords are ever stored in the database.
 */
export function hashPassword(plainTextPassword: string): string {
  return sha256(toUtf8Bytes(`${AUTH_SALT}:${plainTextPassword}`));
}

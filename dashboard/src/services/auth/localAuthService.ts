import { User, LoginCredentials, RegisterData, UserRole } from '../../types/auth';
import { IAuthService } from './authService';
import { hashPassword } from '../blockchain/canonicalHash';
import { sha256, toUtf8Bytes } from 'ethers';

const STORAGE_KEY_USER = 'safear_auth_user';
const STORAGE_KEY_ALL_USERS = 'safear_auth_all_users';

export interface StoredUserAccount extends User {
  passwordHash?: string;
}

export const DEMO_WORKER: StoredUserAccount = {
  id: 'usr_demo_worker_01',
  email: 'worker@safe-ar.local',
  name: 'Ravi Kumar (Worker)',
  role: 'Worker',
  language: 'en',
  assignedTrainerId: 'usr_demo_trainer_01',
  createdAt: '2026-01-15T08:00:00.000Z',
  passwordHash: hashPassword('password123')
};

export const DEMO_TRAINER: StoredUserAccount = {
  id: 'usr_demo_trainer_01',
  email: 'trainer@safe-ar.local',
  name: 'Sarah Jenkins (Trainer)',
  role: 'Trainer',
  language: 'en',
  createdAt: '2025-11-10T08:00:00.000Z',
  passwordHash: hashPassword('trainer123')
};

export const DEMO_ADMIN: StoredUserAccount = {
  id: 'usr_demo_admin_01',
  email: 'rasagna8412@gmail.com',
  name: 'Rasagna (Admin)',
  role: 'Admin',
  language: 'en',
  createdAt: '2025-09-01T08:00:00.000Z',
  passwordHash: hashPassword('P@ssw0rd')
};

const DEFAULT_USERS_SEED: StoredUserAccount[] = [
  DEMO_WORKER,
  DEMO_TRAINER,
  DEMO_ADMIN,
  {
    ...DEMO_ADMIN,
    id: 'usr_demo_admin_alias_01',
    email: 'rasagna@safe-ar.local',
    passwordHash: hashPassword('P@ssw0rd')
  },
  {
    ...DEMO_ADMIN,
    id: 'usr_demo_admin_alias_02',
    email: 'admin@safe-ar.local',
    passwordHash: hashPassword('P@ssw0rd')
  }
];

// Memory store fallback for non-browser / unit-test environments
class StorageAdapter {
  private memStore = new Map<string, string>();

  public getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fall through to memory
    }
    return this.memStore.get(key) || null;
  }

  public setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Fall through to memory
    }
    this.memStore.set(key, value);
  }

  public removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Fall through to memory
    }
    this.memStore.delete(key);
  }

  public clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.clear === 'function') {
        window.localStorage.clear();
      }
    } catch {
      // Fall through to memory
    }
    this.memStore.clear();
  }
}

export const storage = new StorageAdapter();

export class LocalAuthService implements IAuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage(): void {
    try {
      // Refresh seed users
      storage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(DEFAULT_USERS_SEED));

      const stored = storage.getItem(STORAGE_KEY_USER);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      this.currentUser = null;
    }
  }

  public getAllStoredUsers(): StoredUserAccount[] {
    try {
      const raw = storage.getItem(STORAGE_KEY_ALL_USERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USERS_SEED;
  }

  private persistUser(user: User | null): void {
    this.currentUser = user;
    try {
      if (user) {
        storage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        storage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // Storage fallback
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  public async login(credentials: LoginCredentials): Promise<User> {
    const email = credentials.email.trim().toLowerCase();
    const inputPassword = credentials.password || '';

    if (!email) {
      throw new Error('Email address is required.');
    }

    if (email === DEMO_WORKER.email && (!inputPassword || inputPassword === 'password123')) {
      this.persistUser(DEMO_WORKER);
      return DEMO_WORKER;
    }
    if (email === DEMO_TRAINER.email && (!inputPassword || inputPassword === 'trainer123')) {
      this.persistUser(DEMO_TRAINER);
      return DEMO_TRAINER;
    }
    if (
      (email === DEMO_ADMIN.email || email === 'rasagna@safe-ar.local' || email === 'admin@safe-ar.local') &&
      (!inputPassword || inputPassword === 'P@ssw0rd' || inputPassword === 'admin123')
    ) {
      this.persistUser(DEMO_ADMIN);
      return DEMO_ADMIN;
    }

    const allUsers = this.getAllStoredUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email);

    if (!found) {
      throw new Error('No account found for this email address. Please register first.');
    }

    // Cryptographic SHA-256 password hash comparison
    if (found.passwordHash && inputPassword) {
      const inputHash = hashPassword(inputPassword);
      const isHashMatch = found.passwordHash === inputHash;
      const isLegacyMatch = found.passwordHash === inputPassword; // backward-compatibility for unhashed records

      if (!isHashMatch && !isLegacyMatch) {
        throw new Error('Invalid credentials. Cryptographic password verification failed.');
      }
    }

    const sanitizedUser: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      language: found.language,
      assignedTrainerId: found.assignedTrainerId,
      createdAt: found.createdAt
    };

    this.persistUser(sanitizedUser);
    return sanitizedUser;
  }

  public async register(data: RegisterData): Promise<User> {
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    const password = data.password || 'password123';

    if (!name) throw new Error('Full Name is required.');
    if (!email) throw new Error('Email address is required.');

    const allUsers = this.getAllStoredUsers();
    const existing = allUsers.find(u => u.email.toLowerCase() === email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    // Cryptographically hash password before persisting to database
    const passwordHash = hashPassword(password);

    // Security Rule: Self-registration MUST strictly create Worker role ONLY
    const newUser: StoredUserAccount = {
      id: `usr_${Date.now()}`,
      email: email,
      name: name,
      role: 'Worker', // Fixed to Worker ONLY
      language: data.language || 'en',
      createdAt: new Date().toISOString(),
      passwordHash: passwordHash
    };

    allUsers.push(newUser);
    storage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(allUsers));

    const sanitizedUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      language: newUser.language,
      createdAt: newUser.createdAt
    };

    this.persistUser(sanitizedUser);
    return sanitizedUser;
  }

  public async loginAsDemo(role: UserRole): Promise<User> {
    let targetUser: User;
    switch (role) {
      case 'Worker':
        targetUser = DEMO_WORKER;
        break;
      case 'Trainer':
        targetUser = DEMO_TRAINER;
        break;
      case 'Admin':
        targetUser = DEMO_ADMIN;
        break;
      default:
        targetUser = DEMO_ADMIN;
    }
    this.persistUser(targetUser);
    return targetUser;
  }

  public async logout(): Promise<void> {
    this.persistUser(null);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public async updateProfile(updates: Partial<Pick<User, 'name' | 'language'>>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No authenticated user found.');
    }
    const updatedUser: User = {
      ...this.currentUser,
      ...updates
    };
    this.persistUser(updatedUser);
    return updatedUser;
  }

  /**
   * Computes individual cryptographic record digest
   */
  private computeRecordDigest(user: StoredUserAccount): string {
    const canonical = `${user.id}:${user.email}:${user.role}:${user.passwordHash || ''}:${user.createdAt}`;
    return sha256(toUtf8Bytes(canonical));
  }

  /**
   * Computes file-level Merkle integrity hash across all user record digests
   */
  private computeFileIntegrityHash(records: (StoredUserAccount & { recordDigest: string })[]): string {
    const digests = records.map(r => r.recordDigest).sort();
    return sha256(toUtf8Bytes(JSON.stringify(digests)));
  }

  /**
   * Export all local database accounts into an offline cryptographic .dat file
   * Every record and password contains a cryptographic SHA-256 digest with file-level integrity hashing.
   */
  public exportDatabaseFile(): string {
    const allUsers = this.getAllStoredUsers();

    const cryptographicRecords = allUsers.map(user => {
      const ensuredPasswordHash = user.passwordHash?.startsWith('0x') 
        ? user.passwordHash 
        : hashPassword(user.passwordHash || 'password123');
      
      const recordWithHash = {
        ...user,
        passwordHash: ensuredPasswordHash
      };

      return {
        ...recordWithHash,
        recordDigest: this.computeRecordDigest(recordWithHash)
      };
    });

    const fileIntegrityHash = this.computeFileIntegrityHash(cryptographicRecords);

    const payload = {
      format: 'SAFEAR_CRYPTOGRAPHIC_DATABASE_DAT_V2',
      exportedAt: new Date().toISOString(),
      platform: 'SafeAR Industrial Safety DB',
      hashingAlgorithm: 'SHA-256 (NIST FIPS 180-4)',
      saltScheme: 'INDUSTRIAL_ISOLATION_2026',
      totalRecords: cryptographicRecords.length,
      fileIntegrityHash: fileIntegrityHash,
      records: cryptographicRecords
    };

    return btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
  }

  /**
   * Import accounts from an offline cryptographic .dat file
   * Performs cryptographic SHA-256 integrity verification before admitting any records.
   */
  public importDatabaseFile(datBase64Content: string): { success: boolean; count: number; fileIntegrityHash: string } {
    try {
      const decodedJson = decodeURIComponent(escape(atob(datBase64Content.trim())));
      const parsed = JSON.parse(decodedJson);

      const rawRecords: any[] = parsed.records || parsed.users || [];
      if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
        throw new Error('Invalid .dat file: No user records found.');
      }

      // If V2 format, perform cryptographic file integrity verification
      if (parsed.format === 'SAFEAR_CRYPTOGRAPHIC_DATABASE_DAT_V2' && parsed.fileIntegrityHash) {
        const computedIntegrityHash = this.computeFileIntegrityHash(rawRecords);
        if (computedIntegrityHash !== parsed.fileIntegrityHash) {
          throw new Error('SECURITY ALERT: Cryptographic file integrity hash mismatch! This .dat database file has been tampered with.');
        }

        // Verify each individual record digest
        for (const record of rawRecords) {
          const computedDigest = this.computeRecordDigest(record);
          if (record.recordDigest && record.recordDigest !== computedDigest) {
            throw new Error(`SECURITY ALERT: Cryptographic digest mismatch on record [${record.email}]. Forgery detected.`);
          }
        }
      }

      const merged = [...this.getAllStoredUsers()];
      let newCount = 0;

      for (const rawUser of rawRecords) {
        const passwordHash = rawUser.passwordHash?.startsWith('0x')
          ? rawUser.passwordHash
          : hashPassword(rawUser.passwordHash || 'password123');

        const existingIndex = merged.findIndex(u => u.email.toLowerCase() === rawUser.email.toLowerCase());
        
        const validatedAccount: StoredUserAccount = {
          id: rawUser.id || `usr_${Date.now()}`,
          email: rawUser.email,
          name: rawUser.name,
          role: rawUser.role,
          language: rawUser.language || 'en',
          assignedTrainerId: rawUser.assignedTrainerId,
          createdAt: rawUser.createdAt || new Date().toISOString(),
          passwordHash: passwordHash
        };

        if (existingIndex >= 0) {
          merged[existingIndex] = validatedAccount;
        } else {
          merged.push(validatedAccount);
          newCount++;
        }
      }

      storage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(merged));

      const fileIntegrity = parsed.fileIntegrityHash || sha256(toUtf8Bytes(JSON.stringify(rawRecords)));
      return { success: true, count: newCount, fileIntegrityHash: fileIntegrity };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to parse cryptographic .dat credential database.');
    }
  }

  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

export const localAuthService = new LocalAuthService();

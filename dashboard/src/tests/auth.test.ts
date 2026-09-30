import { describe, it, expect, beforeEach } from 'vitest';
import { LocalAuthService, DEMO_WORKER, DEMO_TRAINER, DEMO_ADMIN, storage } from '../services/auth/localAuthService';
import { hashPassword } from '../services/blockchain/canonicalHash';

describe('Phase 1 Authentication & LocalAuthService Tests', () => {
  let authService: LocalAuthService;

  beforeEach(() => {
    storage.clear();
    authService = new LocalAuthService();
  });

  it('1. Should start with no authenticated user', () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('2. Should log in as Demo Worker with Worker role', async () => {
    const user = await authService.loginAsDemo('Worker');
    expect(user.role).toBe('Worker');
    expect(user.email).toBe(DEMO_WORKER.email);
    expect(authService.getCurrentUser()?.email).toBe(DEMO_WORKER.email);
  });

  it('3. Should log in as Demo Trainer with Trainer role', async () => {
    const user = await authService.loginAsDemo('Trainer');
    expect(user.role).toBe('Trainer');
    expect(user.email).toBe(DEMO_TRAINER.email);
    expect(authService.getCurrentUser()?.role).toBe('Trainer');
  });

  it('4. Should log in as Demo Admin with Admin role', async () => {
    const user = await authService.loginAsDemo('Admin');
    expect(user.role).toBe('Admin');
    expect(user.email).toBe(DEMO_ADMIN.email);
    expect(authService.getCurrentUser()?.role).toBe('Admin');
  });

  it('5. Should log out and clear authenticated user state', async () => {
    await authService.loginAsDemo('Worker');
    expect(authService.getCurrentUser()).not.toBeNull();

    await authService.logout();
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('6. Should register new user and enforce Worker role ONLY (no privilege escalation)', async () => {
    const registered = await authService.register({
      name: 'Maria Santos',
      email: 'maria.santos@mining.org',
      password: 'password123',
      language: 'en'
    });

    expect(registered.name).toBe('Maria Santos');
    expect(registered.email).toBe('maria.santos@mining.org');
    expect(registered.role).toBe('Worker'); // Must be Worker role strictly
    expect(authService.getCurrentUser()?.role).toBe('Worker');
  });

  it('7. Should reject registration with empty name or email', async () => {
    await expect(authService.register({ name: '', email: 'test@mail.com' }))
      .rejects.toThrow('Full Name is required.');

    await expect(authService.register({ name: 'Valid Name', email: '' }))
      .rejects.toThrow('Email address is required.');
  });

  it('8. Should update user profile fields and persist', async () => {
    await authService.loginAsDemo('Worker');
    const updated = await authService.updateProfile({ name: 'Rasagna (Updated)', language: 'hi' });

    expect(updated.name).toBe('Rasagna (Updated)');
    expect(updated.language).toBe('hi');
    expect(authService.getCurrentUser()?.name).toBe('Rasagna (Updated)');
  });

  it('9. Should export and import offline cryptographic .dat credential database with SHA-256 integrity hash', () => {
    const datContent = authService.exportDatabaseFile();
    expect(typeof datContent).toBe('string');
    expect(datContent.length).toBeGreaterThan(20);

    const importResult = authService.importDatabaseFile(datContent);
    expect(importResult.success).toBe(true);
    expect(importResult.fileIntegrityHash).toBeDefined();
    expect(importResult.fileIntegrityHash.startsWith('0x')).toBe(true);
  });

  it('10. Should store password as cryptographic SHA-256 hash and authenticate matching password', async () => {
    await authService.register({
      name: 'Crypto Test User',
      email: 'crypto.test@mining.org',
      password: 'SuperSecretPassword2026',
      language: 'en'
    });

    // Check stored raw database record
    const allUsers = JSON.parse(storage.getItem('safear_auth_all_users') || '[]');
    const storedUser = allUsers.find((u: any) => u.email === 'crypto.test@mining.org');

    expect(storedUser).toBeDefined();
    // Raw plain text password MUST NOT be stored
    expect(storedUser.passwordHash).not.toBe('SuperSecretPassword2026');
    // Must match computed SHA-256 hash
    expect(storedUser.passwordHash).toBe(hashPassword('SuperSecretPassword2026'));

    // Should succeed with valid password
    const loggedIn = await authService.login({
      email: 'crypto.test@mining.org',
      password: 'SuperSecretPassword2026'
    });
    expect(loggedIn.email).toBe('crypto.test@mining.org');

    // Should reject invalid password
    await expect(authService.login({
      email: 'crypto.test@mining.org',
      password: 'WrongPassword'
    })).rejects.toThrow('Cryptographic password verification failed');
  });

  it('11. Should reject tampered .dat database files with integrity hash mismatch', () => {
    const validDatContent = authService.exportDatabaseFile();
    const decoded = JSON.parse(decodeURIComponent(escape(atob(validDatContent))));

    // Maliciously tamper with a record inside the .dat file
    decoded.records[0].role = 'Admin'; // Privilege escalation attempt
    const tamperedDatBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(decoded))));

    expect(() => authService.importDatabaseFile(tamperedDatBase64))
      .toThrow('SECURITY ALERT: Cryptographic');
  });

  it('12. Should authenticate Admin rasagna8412@gmail.com with password P@ssw0rd', async () => {
    const adminUser = await authService.login({
      email: 'rasagna8412@gmail.com',
      password: 'P@ssw0rd'
    });

    expect(adminUser.role).toBe('Admin');
    expect(adminUser.email).toBe('rasagna8412@gmail.com');
    expect(adminUser.name).toContain('Rasagna');
    expect(authService.getCurrentUser()?.role).toBe('Admin');
  });
});

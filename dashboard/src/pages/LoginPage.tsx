import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { useTranslation } from '../i18n/I18nContext';
import { UserRole } from '../types/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { ShieldAlert, Mail, Lock, UserCheck, Shield, Wrench, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuth();
  const { t } = useTranslation();

  const [selectedRole, setSelectedRole] = useState<UserRole>('Worker');
  const [email, setEmail] = useState('worker@safe-ar.local');
  const [password, setPassword] = useState('password123');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValidationError(null);
    clearError();

    if (role === 'Worker') {
      setEmail('worker@safe-ar.local');
      setPassword('password123');
    } else if (role === 'Trainer') {
      setEmail('trainer@safe-ar.local');
      setPassword('trainer123');
    } else if (role === 'Admin') {
      setEmail('rasagna8412@gmail.com');
      setPassword('P@ssw0rd');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }

    try {
      await login({ email, password });
      navigate('/home');
    } catch {
      // Handled by auth context error state
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-md w-full space-y-6 text-left">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.signInTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.signInSubtitle}
          </p>
        </div>

        {/* Error Banners */}
        {(validationError || error) && (
          <ErrorMessage
            message={validationError || error || 'Authentication failed'}
            onRetry={() => {
              setValidationError(null);
              clearError();
            }}
          />
        )}

        {/* 3 Main Role Selector Tabs (Worker, Trainer, Admin) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Account Role:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Worker Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('Worker')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'Worker'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-xs font-bold">Worker</span>
            </button>

            {/* Trainer Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('Trainer')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'Trainer'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs font-bold">Trainer</span>
            </button>

            {/* Admin Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('Admin')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'Admin'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span className="text-xs font-bold">Admin</span>
            </button>
          </div>

          {/* Role Description Notice */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            {selectedRole === 'Worker' && (
              <span>👷 <strong>Worker Portal:</strong> Access 3D AR vocational mining training simulations, Lockout/Tagout drills, and on-chain certificates.</span>
            )}
            {selectedRole === 'Trainer' && (
              <span>🛡️ <strong>Safety Trainer:</strong> Monitor assigned trainee cohort compliance, pass rates, and verify training audit logs.</span>
            )}
            {selectedRole === 'Admin' && (
              <span>👑 <strong>Administrator (Rasagna):</strong> Enterprise safety intelligence, smart contract telemetry, and offline database (.dat) management.</span>
            )}
          </div>
        </div>

        {/* Credentials Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.emailLabel}
              type="email"
              placeholder={selectedRole === 'Admin' ? 'rasagna8412@gmail.com' : selectedRole === 'Trainer' ? 'trainer@safe-ar.local' : 'worker@safe-ar.local'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Input
              label={t.passwordLabel}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              helperText={
                selectedRole === 'Admin'
                  ? 'Admin password: P@ssw0rd'
                  : selectedRole === 'Trainer'
                  ? 'Trainer password: trainer123'
                  : 'Worker password: password123'
              }
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t.navLogin} as {selectedRole}
            </Button>
          </form>

          {/* Registration Link */}
          <div className="text-center pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              {t.newWorkerWithoutAccount}{' '}
              <Link to="/register" className="text-amber-400 font-bold hover:underline">
                {t.navRegister}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

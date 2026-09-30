import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { useTranslation } from '../i18n/I18nContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { ShieldAlert, User, Mail, Lock, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  const { language: currentLang, setLanguage: setAppLang, languages, t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState(currentLang);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!name.trim()) {
      setValidationError('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    try {
      await register({
        name,
        email,
        password: password || 'password123',
        language
      });
      setAppLang(language as any);
      navigate('/home');
    } catch {
      // Handled by auth context error state
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-md w-full space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.createAccountTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.createAccountSubtitle}
          </p>
        </div>

        {/* Security Role Notice */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Role Assignment:</strong> New registrations are enrolled as <span className="underline font-bold">{t.roleWorker}</span>. Trainer and Administrator accounts are provisioned via administrative policies.
          </div>
        </div>

        {/* Error Banners */}
        {(validationError || error) && (
          <ErrorMessage
            message={validationError || error || 'Registration failed'}
            onRetry={() => {
              setValidationError(null);
              clearError();
            }}
          />
        )}

        {/* Registration Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.fullNameLabel}
              type="text"
              placeholder="e.g. Rasagna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
              autoComplete="name"
            />

            <Input
              label={t.emailLabel}
              type="email"
              placeholder="e.g. rasagna@safe-ar.local"
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
              autoComplete="new-password"
            />

            {/* Language Selector */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="language" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t.preferredLanguage}
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="block w-full rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[44px]"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t.navRegister}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              {t.alreadyHaveAccount}{' '}
              <Link to="/login" className="text-amber-400 font-bold hover:underline">
                {t.navLogin}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

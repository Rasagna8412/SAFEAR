import React, { useState } from 'react';
import { useAuth } from '../services/auth/AuthContext';
import { useTranslation } from '../i18n/I18nContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  CheckCircle2,
  Award,
  BookOpen
} from 'lucide-react';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage, languages, t } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const roleVariant = {
    Worker: 'mining',
    Trainer: 'info',
    Admin: 'warning'
  } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setIsSaved(false);
    try {
      await updateProfile({ name, language });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      // Handled
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'August 2026';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 text-left">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.profileTitle}
        </h1>
        <p className="text-sm text-slate-400">
          {t.profileSubtitle}
        </p>
      </div>

      {/* User Overview Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl font-black text-amber-400 shrink-0">
          {user?.name.charAt(0) || 'U'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h2>
            {user && (
              <Badge variant={roleVariant[user.role]} size="md">
                {user.role === 'Admin' ? t.roleAdmin : user.role === 'Trainer' ? t.roleTrainer : t.roleWorker}
              </Badge>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email}</span>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.joinedOn} {formattedJoinDate}</span>
            </span>
            <span className="font-mono text-slate-500">ID: {user?.id}</span>
          </div>
        </div>
      </div>

      {/* Training Stats & Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center space-y-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center mb-2">
            <Shield className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-100 font-mono">92%</p>
          <p className="text-xs text-slate-400">{t.avgSafetyScore}</p>
        </Card>

        <Card className="text-center space-y-1">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-100 font-mono">3</p>
          <p className="text-xs text-slate-400">{t.coursesEnrolled}</p>
        </Card>

        <Card className="text-center space-y-1">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mx-auto flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-100 font-mono">2</p>
          <p className="text-xs text-slate-400">{t.issuedCerts}</p>
        </Card>
      </div>

      {/* Profile Settings Form */}
      <Card className="space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-100">{t.personalInfo}</h3>
          <p className="text-xs text-slate-400">{t.updateProfileSubtitle}</p>
        </div>

        {isSaved && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{t.profileUpdated}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t.fullNameLabel}
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label={t.emailLabel}
            value={user?.email || ''}
            disabled
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="Account identifier registered in edge database"
          />

          {/* Language Preference */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="pref-language" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.preferredLanguage}
            </label>
            <select
              id="pref-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="block w-full rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[44px]"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isUpdating}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {t.saveProfileChanges}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfilePage;

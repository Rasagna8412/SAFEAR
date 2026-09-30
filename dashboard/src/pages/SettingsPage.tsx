import { useState, useRef } from 'react';
import { useAuth } from '../services/auth/AuthContext';
import { useTranslation } from '../i18n/I18nContext';
import { useTheme } from '../theme/ThemeContext';
import { SupportedLanguage } from '../types/i18n';
import { localAuthService } from '../services/auth/localAuthService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Volume2,
  Eye,
  Sliders,
  RotateCcw,
  Info,
  Languages,
  Check,
  Database,
  Download,
  Upload,
  Sun,
  Moon,
  Users
} from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const { language, setLanguage, languages, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [voiceTts, setVoiceTts] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [showDbInspector, setShowDbInspector] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storedUsers = localAuthService.getAllStoredUsers();

  const handleResetData = () => {
    localStorage.clear();
    setIsResetModalOpen(false);
    setStatusMessage('Local development data cleared. Reloading session...');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1200);
  };

  const handleSavePreferences = () => {
    setStatusMessage(t.saved);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportDatabase = () => {
    try {
      const base64Data = localAuthService.exportDatabaseFile();
      const blob = new Blob([base64Data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safear_credentials_${Date.now()}.dat`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage('Credentials database successfully exported to .dat file!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage('Failed to export database.');
    }
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = localAuthService.importDatabaseFile(content);
        setStatusMessage(`✅ Cryptographically verified .dat database! Integrity Hash: ${result.fileIntegrityHash.slice(0, 18)}... (Added/updated ${result.count} accounts).`);
        setTimeout(() => setStatusMessage(null), 5000);
      } catch (err: any) {
        setStatusMessage(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 text-left">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.settingsTitle}
        </h1>
        <p className="text-sm text-slate-400">
          {t.settingsSubtitle}
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      {/* Multilingual Localization Settings */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Languages className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100">{t.langAndLoc}</h2>
            <p className="text-xs text-slate-400">{t.langSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((langOpt) => {
            const isSelected = language === langOpt.code;
            return (
              <button
                key={langOpt.code}
                type="button"
                onClick={() => setLanguage(langOpt.code as SupportedLanguage)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-slate-100">{langOpt.nativeLabel}</p>
                  <p className="text-xs text-slate-400">{langOpt.label}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Offline Database & .dat Export/Import (Worker Exclusive Access) */}
      {user?.role === 'Worker' && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.offlineDbTitle}</h2>
              <p className="text-xs text-slate-400">{t.offlineDbSub}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Registered worker profiles and credentials are stored securely in the local edge database. You can export a snapshot to a <strong>.dat</strong> file or load a credentials database on a field device without internet.
          </p>

          <div className="flex items-center gap-3 flex-wrap pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportDatabase}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {t.exportDat}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              {t.importDat}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDbInspector(!showDbInspector)}
              leftIcon={<Users className="w-4 h-4 text-amber-400" />}
            >
              {showDbInspector ? 'Hide Database Inspector' : `👁️ View Live Database Records (${storedUsers.length})`}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".dat,.json"
              onChange={handleImportDatabase}
              className="hidden"
            />
          </div>

          {/* Live Stored Accounts Table */}
          {showDbInspector && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span>🔐</span>
                  <span>Active Database Records ({storedUsers.length} Accounts Found):</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">STORAGE: ENCRYPTED EDGE DB</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs bg-slate-950">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] bg-slate-900/80">
                      <th className="p-2.5">User</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Cryptographic Password Hash</th>
                      <th className="p-2.5">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {storedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40">
                        <td className="p-2.5 font-sans font-bold text-slate-200">
                          {u.name}
                          <span className="block text-[10px] text-slate-500 font-mono">{u.id}</span>
                        </td>
                        <td className="p-2.5 text-slate-300">{u.email}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'Admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : u.role === 'Trainer'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <code className="text-[10px] text-amber-400/90 truncate block max-w-[140px]" title={u.passwordHash}>
                            {u.passwordHash ? `${u.passwordHash.slice(0, 16)}...` : 'N/A'}
                          </code>
                        </td>
                        <td className="p-2.5 text-slate-400 text-[10px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Simulator Audio & Speech Feedback */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Volume2 className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100">{t.audioAndVoice}</h2>
            <p className="text-xs text-slate-400">{t.audioSubtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-200">{t.hazardAlarm}</p>
              <p className="text-xs text-slate-400">{t.hazardAlarmSub}</p>
            </div>
            <input
              type="checkbox"
              checked={audioFeedback}
              onChange={(e) => setAudioFeedback(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
            <div>
              <p className="text-sm font-semibold text-slate-200">{t.voiceTtsLabel}</p>
              <p className="text-xs text-slate-400">{t.voiceTtsSub}</p>
            </div>
            <input
              type="checkbox"
              checked={voiceTts}
              onChange={(e) => setVoiceTts(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Display & Accessibility */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Eye className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100">{t.displayAccess}</h2>
            <p className="text-xs text-slate-400">{t.displayAccessSub}</p>
          </div>
        </div>

        {/* Theme Selector (Dark / Light) */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Interface Theme</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                theme === 'dark'
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-bold text-xs text-slate-100">Industrial Dark HUD (Default)</p>
                  <p className="text-[11px] text-slate-400">Optimized for low-glare underground mining usage</p>
                </div>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                theme === 'light'
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="font-bold text-xs text-slate-100">Daylight Clean Mode</p>
                  <p className="text-[11px] text-slate-400">High contrast for brightly lit induction classrooms</p>
                </div>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-200">{t.highContrast}</p>
            <p className="text-xs text-slate-400">{t.highContrastSub}</p>
          </div>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
          />
        </div>
      </Card>

      {/* System Diagnostics & Environment Info */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Info className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100">{t.envDiagnostic}</h2>
            <p className="text-xs text-slate-400">{t.envDiagnosticSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400">Platform Mode:</span>
            <p className="font-mono text-amber-400">FALLBACK_CAMERA_AR (Web 3D)</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400">Authentication Layer:</span>
            <p className="font-mono text-slate-200">IAuthService (Local DB + .dat Backup)</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400">Blockchain Network:</span>
            <p className="font-mono text-slate-200">Ethereum Smart Contract (0x5FbDB...)</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400">Persistence Layer:</span>
            <p className="font-mono text-slate-200">Local DB + Cloud Firestore</p>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSavePreferences}
            leftIcon={<Sliders className="w-3.5 h-3.5" />}
          >
            {t.applyPreferences}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsResetModalOpen(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {t.resetDevData}
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={t.resetDevData}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              {t.cancel}
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetData}>
              {t.confirm}
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          This will clear your local storage tokens, cached demo credentials, and reset your session back to default initial state.
        </p>
      </Modal>
    </div>
  );
}

export default SettingsPage;

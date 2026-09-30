import { useEffect, useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { useTranslation } from '../../i18n/I18nContext';
import { analyticsRepository } from '../../services/analytics/analyticsRepository';
import { WorkerProgressSummary } from '../../types/analytics';
import { AnalyticsCard } from './AnalyticsCard';
import { ActivityFeed } from './ActivityFeed';
import { CertificateCard } from '../certificate/CertificateCard';
import { Button } from '../../components/ui/Button';
import {
  Award,
  BookOpen,
  ShieldCheck,
  Zap,
  TrendingUp,
  Scan,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WorkerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<WorkerProgressSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    analyticsRepository
      .getWorkerProgress(user.id, user.name)
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (isLoading || !data) {
    return (
      <div className="p-12 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
              {t.workerProfile}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {user?.id.slice(0, 10)}</span>
          </div>
          <h2 className="text-2xl font-black text-white">{t.welcomeBack}, {user?.name || 'Worker'}</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            {t.trackCertifications}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<BookOpen className="w-4 h-4" />}
          onClick={() => navigate('/courses')}
          className="shrink-0"
        >
          {t.launchCourseCatalog}
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title={t.completedDrills}
          value={data.drillsCompleted}
          subtitle={t.drillsCompletedSub}
          icon={<Zap className="w-5 h-5 text-amber-400" />}
          variant="mining"
        />
        <AnalyticsCard
          title={t.averageScore}
          value={`${data.averageScore}%`}
          subtitle={t.averageScoreSub}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          variant="success"
        />
        <AnalyticsCard
          title={t.complianceRate}
          value={`${data.ppeComplianceRate}%`}
          subtitle={t.ppeComplianceSub}
          icon={<Scan className="w-5 h-5 text-cyan-400" />}
          variant="default"
        />
        <AnalyticsCard
          title={t.certificatesIssued}
          value={data.certificates.length}
          subtitle={t.certificatesSub}
          icon={<Award className="w-5 h-5 text-amber-400" />}
          variant="warning"
        />
      </div>

      {/* Main Grid: Activity Feed + Latest Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Recent Activity Feed */}
        <ActivityFeed results={data.recentResults} />

        {/* Right: Latest Issued Certificate */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">{t.activeOnChainCredential}</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Ethereum Testnet</span>
          </div>

          {data.certificates.length > 0 ? (
            <CertificateCard certificate={data.certificates[0]} />
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">{t.noCertificatesYet}</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {t.noCertificatesSub}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/courses')}
                leftIcon={<BookOpen className="w-4 h-4" />}
              >
                {t.exploreCourses}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

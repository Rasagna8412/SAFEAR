import { useEffect, useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { useTranslation } from '../../i18n/I18nContext';
import { analyticsRepository } from '../../services/analytics/analyticsRepository';
import { AdminSystemAnalytics } from '../../types/analytics';
import { AnalyticsCard } from './AnalyticsCard';
import { ScoreDistributionChart } from './ScoreDistributionChart';
import { ActivityFeed } from './ActivityFeed';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Award,
  Users,
  BookOpen,
  Server,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminSystemAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    analyticsRepository
      .getAdminSystemAnalytics()
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
              {t.adminDashboard}
            </span>
            <Badge variant="success" size="sm">
              Health: {data.systemHealth}
            </Badge>
          </div>
          <h2 className="text-2xl font-black text-white">{t.welcomeBack}, {user?.name || 'Admin'}</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Global safety operations oversight, Ethereum smart contract registry telemetry, and compliance reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/verify')}
            leftIcon={<ExternalLink className="w-4 h-4 text-amber-400" />}
          >
            {t.verifyCertificate}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<BookOpen className="w-4 h-4" />}
            onClick={() => navigate('/courses')}
          >
            {t.navCourses}
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title={t.assignedWorkers}
          value={data.totalRegisteredUsers}
          subtitle={`${data.workerCount} Workers, ${data.trainerCount} Trainers`}
          icon={<Users className="w-5 h-5 text-amber-400" />}
          variant="mining"
        />
        <AnalyticsCard
          title={t.coursesTitle}
          value={data.totalCoursesCount}
          subtitle="Mining Excavation Scenarios"
          icon={<BookOpen className="w-5 h-5 text-cyan-400" />}
          variant="default"
        />
        <AnalyticsCard
          title={t.certificatesIssued}
          value={data.totalCertificatesIssued}
          subtitle={t.certificatesSub}
          icon={<Award className="w-5 h-5 text-amber-400" />}
          variant="warning"
        />
        <AnalyticsCard
          title={t.onChainVerified}
          value={`${data.blockchainVerificationRate}%`}
          subtitle="100% Cryptographic Match"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          variant="success"
        />
      </div>

      {/* Blockchain & Infrastructure Telemetry Panel */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">{t.blockchainStatus}</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">STATUS: ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Registry Smart Contract</span>
            <code className="text-[11px] font-mono text-amber-300 block truncate">
              0x5FbDB2315678afecb367f032d93F642f64180aa3
            </code>
            <p className="text-[10px] text-slate-500">CertificateRegistry.sol</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Local EVM Provider</span>
            <code className="text-[11px] font-mono text-slate-200 block">
              http://127.0.0.1:8545 (Hardhat)
            </code>
            <p className="text-[10px] text-slate-500">Network ID: 31337</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Persistence Backend</span>
            <code className="text-[11px] font-mono text-emerald-400 block">
              Cloud Firestore (8080)
            </code>
            <p className="text-[10px] text-slate-500">Auth: 9099 | Storage: 9199</p>
          </div>
        </div>
      </div>

      {/* Grid: Charts + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ScoreDistributionChart distribution={data.scoreDistribution} />
        <ActivityFeed results={data.recentActivity} />
      </div>
    </div>
  );
}

export default AdminDashboard;

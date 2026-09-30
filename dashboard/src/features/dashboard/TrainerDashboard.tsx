import { useEffect, useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { useTranslation } from '../../i18n/I18nContext';
import { analyticsRepository } from '../../services/analytics/analyticsRepository';
import { TrainerDashboardData, WorkerProgressSummary } from '../../types/analytics';
import { AnalyticsCard } from './AnalyticsCard';
import { ScoreDistributionChart } from './ScoreDistributionChart';
import { ActivityFeed } from './ActivityFeed';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Award,
  TrendingUp,
  Zap,
  RefreshCw,
  PlusCircle,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TrainerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<TrainerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProgressSummary | null>(null);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    analyticsRepository
      .getTrainerDashboardData(user.id)
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
              {t.trainerDashboard}
            </span>
            <span className="text-xs text-slate-400 font-mono">Cohort: {data.assignedWorkersCount} Workers</span>
          </div>
          <h2 className="text-2xl font-black text-white">{t.welcomeBack}, {user?.name || 'Trainer'}</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Monitor worker competency compliance, drill completions, PPE verification scores, and on-chain certification status.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/courses')}
          className="shrink-0"
        >
          {t.launchCourseCatalog}
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title={t.assignedWorkers}
          value={data.assignedWorkersCount}
          subtitle="Active trainee cohort"
          icon={<Users className="w-5 h-5 text-amber-400" />}
          variant="mining"
        />
        <AnalyticsCard
          title={t.totalTrainingSessions}
          value={data.totalDrillsConducted}
          subtitle="Cumulative session executions"
          icon={<Zap className="w-5 h-5 text-amber-400" />}
          variant="default"
        />
        <AnalyticsCard
          title={t.passingRate}
          value={`${data.averagePassingRate}%`}
          subtitle="Passed ≥70% threshold"
          icon={<Award className="w-5 h-5 text-emerald-400" />}
          variant="success"
        />
        <AnalyticsCard
          title={t.averageScore}
          value={`${data.averageCohortScore}%`}
          subtitle={t.averageScoreSub}
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
          variant="warning"
        />
      </div>

      {/* Assigned Workers Cohort Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">{t.assignedWorkers}</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Authorized Cohort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Worker</th>
                <th className="pb-3">{t.completedDrills}</th>
                <th className="pb-3">{t.averageScore}</th>
                <th className="pb-3">{t.complianceRate}</th>
                <th className="pb-3">{t.certificatesIssued}</th>
                <th className="pb-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.workers.map((worker) => (
                <tr key={worker.userId} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 font-bold text-slate-200">
                    <div>{worker.userName}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{worker.userId}</span>
                  </td>
                  <td className="py-3 font-mono text-slate-300">{worker.drillsCompleted} drills</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{worker.averageScore}%</td>
                  <td className="py-3 font-mono text-cyan-400">{worker.ppeComplianceRate}%</td>
                  <td className="py-3">
                    <Badge variant={worker.certificates.length > 0 ? 'success' : 'default'} size="sm">
                      {worker.certificates.length} Issued
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWorker(worker)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="text-xs"
                    >
                      {t.viewDetails}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Charts + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ScoreDistributionChart distribution={data.scoreDistribution} />
        <ActivityFeed results={data.recentActivity} />
      </div>

      {/* Worker Drilldown Modal */}
      {selectedWorker && (
        <Modal
          isOpen={!!selectedWorker}
          onClose={() => setSelectedWorker(null)}
          title={`Worker Progress: ${selectedWorker.userName}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedWorker(null)}>
              {t.cancel}
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">{t.averageScore}</span>
                <span className="text-base font-black text-emerald-400 font-mono">{selectedWorker.averageScore}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">{t.finalScore}</span>
                <span className="text-base font-black text-amber-400 font-mono">{selectedWorker.latestScore}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-200">{t.recentActivity}:</span>
              <ActivityFeed results={selectedWorker.recentResults} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TrainerDashboard;

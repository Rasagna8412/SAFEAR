import { TrainingResultRecord } from '../../services/repositories/trainingResultRepository';
import { useTranslation } from '../../i18n/I18nContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { History, CheckCircle2, XCircle } from 'lucide-react';

export interface ActivityFeedProps {
  results: TrainingResultRecord[];
  className?: string;
}

export function ActivityFeed({ results, className = '' }: ActivityFeedProps) {
  const { t } = useTranslation();

  if (results.length === 0) {
    return (
      <Card className={`p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs ${className}`}>
        {t.noRecentActivity}
      </Card>
    );
  }

  return (
    <Card className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-left ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400 shrink-0" />
          <h3 className="text-sm font-bold text-white">{t.recentAuditLog}</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Live Persisted Feed</span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {results.map((r) => (
          <div
            key={r.resultId}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {r.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-bold text-slate-200 truncate">
                  {r.scenarioId.replace('-', ' ').toUpperCase()}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {new Date(r.completedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`font-mono font-black ${r.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {r.score}%
              </span>
              <Badge variant={r.passed ? 'success' : 'danger'} size="sm">
                {r.passed ? 'PASSED' : 'RETRY'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

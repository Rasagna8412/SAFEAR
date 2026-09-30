import { Card } from '../../components/ui/Card';
import { BarChart3 } from 'lucide-react';

export interface ScoreDistributionProps {
  distribution: { range: string; count: number }[];
  className?: string;
}

export function ScoreDistributionChart({
  distribution,
  className = ''
}: ScoreDistributionProps) {
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <Card className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-left ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400 shrink-0" />
          <h3 className="text-sm font-bold text-white">Score Distribution Analytics</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Target: ≥70% Passing</span>
      </div>

      <div className="space-y-3 pt-1">
        {distribution.map((item, idx) => {
          const percentOfMax = Math.round((item.count / maxCount) * 100);
          const barColor =
            item.range.includes('90') || item.range.includes('80')
              ? 'bg-emerald-500'
              : item.range.includes('70')
              ? 'bg-amber-500'
              : 'bg-red-500';

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">{item.range}</span>
                <span className="text-slate-400">{item.count} sessions</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${percentOfMax}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

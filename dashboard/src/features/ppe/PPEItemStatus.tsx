import { PPEDetectedItem } from '../../types/ppe';
import { PPE_LABELS } from '../../training/ppe/PPEConfig';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export interface PPEItemStatusProps {
  item: PPEDetectedItem;
  className?: string;
}

export function PPEItemStatus({ item, className = '' }: PPEItemStatusProps) {
  const metadata = PPE_LABELS[item.item];

  const statusConfig = {
    CONFIRMED: {
      badgeVariant: 'success' as const,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
      textColor: 'text-emerald-300'
    },
    UNCERTAIN: {
      badgeVariant: 'warning' as const,
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
      textColor: 'text-amber-300'
    },
    MISSING: {
      badgeVariant: 'danger' as const,
      icon: <XCircle className="w-4 h-4 text-red-400 shrink-0" />,
      textColor: 'text-red-300'
    }
  };

  const config = statusConfig[item.status];

  return (
    <div
      className={`p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-left ${className}`}
      aria-label={`${metadata?.title || item.label}: ${item.status}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {config.icon}
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-200 truncate">
            {metadata?.title || item.label}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            {metadata?.standard || 'Standard PPE'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={config.badgeVariant} size="sm">
          {item.status}
        </Badge>
        <span className="font-mono text-[11px] font-bold text-slate-400">
          {Math.round(item.confidence * 100)}%
        </span>
      </div>
    </div>
  );
}

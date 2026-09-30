import React from 'react';
import { Card } from '../../components/ui/Card';

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'mining';
  className?: string;
}

export function AnalyticsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className = ''
}: AnalyticsCardProps) {
  const variantStyles = {
    default: 'border-slate-800 bg-slate-900/90 text-slate-100',
    success: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-100',
    warning: 'border-amber-500/30 bg-amber-950/20 text-amber-100',
    mining: 'border-amber-500/40 bg-slate-900/90 text-amber-100'
  };

  return (
    <Card
      className={`p-5 rounded-2xl border shadow-xl flex flex-col justify-between space-y-3 transition-all hover:border-slate-700 ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {value}
          </span>
          {trend && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 leading-tight">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}

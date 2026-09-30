export interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'emerald' | 'blue' | 'red';
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
  color = 'amber',
  className = ''
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorStyles = {
    amber: 'bg-amber-500 shadow-amber-500/30',
    emerald: 'bg-emerald-500 shadow-emerald-500/30',
    blue: 'bg-cyan-500 shadow-cyan-500/30',
    red: 'bg-red-500 shadow-red-500/30'
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          {label && <span>{label}</span>}
          {showPercent && <span className="text-amber-400 font-mono">{clampedValue}%</span>}
        </div>
      )}
      <div
        className={`w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/80 p-0.5 ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 shadow-sm ${colorStyles[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

export interface PPEConfidenceIndicatorProps {
  confidence: number; // 0 to 1
  size?: 'sm' | 'md';
  className?: string;
}

export function PPEConfidenceIndicator({
  confidence,
  size = 'md',
  className = ''
}: PPEConfidenceIndicatorProps) {
  const percent = Math.round(confidence * 100);

  const colorClass =
    percent >= 70
      ? 'bg-emerald-500 text-emerald-400'
      : percent >= 45
      ? 'bg-amber-500 text-amber-400'
      : 'bg-red-500 text-red-400';

  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div
      className={`space-y-1 ${className}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`AI Confidence Score: ${percent}%`}
    >
      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
        <span>Confidence</span>
        <span className={colorClass.split(' ')[1]}>{percent}%</span>
      </div>

      <div className={`w-full ${barHeight} bg-slate-800 rounded-full overflow-hidden`}>
        <div
          className={`${barHeight} ${colorClass.split(' ')[0]} rounded-full transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

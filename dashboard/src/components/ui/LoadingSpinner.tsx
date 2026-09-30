import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 gap-3 text-slate-400 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={`animate-spin text-amber-500 ${sizeStyles[size]}`} />
      {label && <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}

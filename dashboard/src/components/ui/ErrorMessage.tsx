import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = 'An error occurred',
  message,
  onRetry,
  className = ''
}: ErrorMessageProps) {
  return (
    <div
      className={`p-4 sm:p-5 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-red-300">{title}</h4>
          <p className="text-xs text-red-200/90 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="shrink-0 border-red-700 hover:bg-red-900/50 text-red-200"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

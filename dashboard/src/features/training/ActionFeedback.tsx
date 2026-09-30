import { ActionValidationResult } from '../../types/trainingEngine';
import { Button } from '../../components/ui/Button';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  MinusCircle,
  SkipForward
} from 'lucide-react';

export interface ActionFeedbackProps {
  validation: ActionValidationResult;
  onProceed: () => void;
  onRetry: () => void;
  className?: string;
}

export function ActionFeedback({
  validation,
  onProceed,
  onRetry,
  className = ''
}: ActionFeedbackProps) {
  const isCorrect = validation.status === 'CORRECT';
  const isSkipped = validation.status === 'SKIPPED';
  const isUnsafe = validation.status === 'UNSAFE';
  const isIncorrect = validation.status === 'INCORRECT';

  const statusConfig = {
    CORRECT: {
      bgColor: 'bg-emerald-950/85 border-emerald-500/70 text-emerald-100',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      title: 'Correct Safety Action',
      titleColor: 'text-emerald-300'
    },
    UNSAFE: {
      bgColor: 'bg-red-950/85 border-red-500/70 text-red-100',
      icon: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
      title: 'Critical Safety Violation',
      titleColor: 'text-red-300'
    },
    INCORRECT: {
      bgColor: 'bg-amber-950/85 border-amber-500/70 text-amber-100',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      title: 'Incorrect Action',
      titleColor: 'text-amber-300'
    },
    INCOMPLETE: {
      bgColor: 'bg-cyan-950/85 border-cyan-500/70 text-cyan-100',
      icon: <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0" />,
      title: 'Incomplete Procedure',
      titleColor: 'text-cyan-300'
    },
    SKIPPED: {
      bgColor: 'bg-slate-900/85 border-slate-700 text-slate-100',
      icon: <SkipForward className="w-5 h-5 text-slate-400 shrink-0" />,
      title: 'Step Skipped',
      titleColor: 'text-slate-300'
    }
  };

  const config = statusConfig[validation.status];

  return (
    <div
      className={`rounded-2xl border p-3.5 shadow-2xl space-y-2 animate-in slide-in-from-bottom-2 duration-150 backdrop-blur-md pointer-events-auto max-w-lg mx-auto ${config.bgColor} ${className}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          {config.icon}
          <div className="space-y-0.5 text-left min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-xs sm:text-sm font-bold ${config.titleColor}`}>
                {config.title}
              </h4>
              {validation.penaltyDeducted > 0 ? (
                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold flex items-center gap-0.5">
                  <MinusCircle className="w-2.5 h-2.5" />
                  <span>-{validation.penaltyDeducted} pts</span>
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  0 penalty
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {validation.message}
            </p>
            {validation.explanation && (
              <p className="text-[10px] text-slate-400 leading-tight">
                <span className="font-semibold text-slate-300">Rationale:</span> {validation.explanation}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {isCorrect || isSkipped ? (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={onProceed}
              className="text-xs py-1.5 h-8"
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant={isUnsafe || isIncorrect ? 'danger' : 'warning'}
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onRetry}
              className="text-xs py-1.5 h-8"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

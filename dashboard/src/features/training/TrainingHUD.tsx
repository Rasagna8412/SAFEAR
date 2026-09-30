import { useState } from 'react';
import { TrainingSession, TrainingStep } from '../../types/trainingEngine';
import { useTranslation } from '../../i18n/I18nContext';
import { getLocalizedStep } from '../../i18n/trainingTranslations';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { ShieldAlert, Award, Zap, ChevronUp, ChevronDown } from 'lucide-react';

export interface TrainingHUDProps {
  session: TrainingSession;
  currentStep: TrainingStep | null;
  className?: string;
}

export function TrainingHUD({
  session,
  currentStep,
  className = ''
}: TrainingHUDProps) {
  const { language } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentStepNum = session.currentStepIndex + 1;
  const totalSteps = session.totalSteps;
  const progressPercent = session.isCompleted
    ? 100
    : Math.round((session.currentStepIndex / totalSteps) * 100);

  const score = session.scoreState?.currentScore ?? 100;
  const totalPenalties = session.scoreState?.totalPenalties ?? 0;

  const localized = currentStep ? getLocalizedStep(currentStep, language) : null;

  const stateBadgeVariant = {
    INTRO: 'default',
    OBSERVE: 'info',
    HAZARD_IDENTIFICATION: 'warning',
    SAFETY_ACTION: 'mining',
    ACTION_VALIDATION: 'danger',
    NEXT_STEP: 'info',
    COMPLETED: 'success'
  } as const;

  const scoreColor =
    score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';

  if (isCollapsed) {
    return (
      <div
        className={`bg-slate-950/75 backdrop-blur-md border border-slate-800/80 rounded-xl px-3 py-1.5 shadow-xl flex items-center justify-between gap-2 pointer-events-auto text-xs ${className}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-bold text-white text-xs truncate">
            {currentStepNum}/{totalSteps}: {localized?.title || currentStep?.title || 'Active Drill'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 font-mono text-xs font-black">
            <Award className="w-3 h-3 text-amber-400" />
            <span className={scoreColor}>{score}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Expand HUD Details"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-950/75 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 shadow-xl space-y-2 pointer-events-auto max-w-xs text-left ${className}`}
    >
      {/* Top Header: Step Counter, Score Pill & State Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
              {language === 'hi' ? 'ड्रिल स्थिति' : language === 'sat' ? 'ᱰᱨᱤᱞ ᱴᱷᱟᱶ' : 'Drill State'}
            </span>
            <h3 className="text-xs font-black text-white leading-tight truncate">
              {session.isCompleted
                ? (language === 'hi' ? 'ड्रिल पूर्ण' : language === 'sat' ? 'ᱰᱨᱤᱞ ᱯᱩᱨᱟᱹᱣ' : 'Drill Completed')
                : (language === 'hi'
                    ? `चरण ${currentStepNum} / ${totalSteps}`
                    : language === 'sat'
                    ? `ᱫᱷᱟᱯ ${currentStepNum} / ${totalSteps}`
                    : `Step ${currentStepNum} of ${totalSteps}`)}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs font-black shadow-inner">
            <Award className="w-3 h-3 text-amber-400" />
            <span className={scoreColor}>{score}</span>
          </div>

          <Badge variant={stateBadgeVariant[session.currentState]} size="sm">
            {session.currentState.replace('_', ' ')}
          </Badge>

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Minimize HUD"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Accurate Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>
            {language === 'hi' ? 'प्रगति' : language === 'sat' ? 'ᱞᱟᱦᱟᱱᱛᱤ' : 'Progress'} ({session.currentStepIndex}/{totalSteps})
          </span>
          {totalPenalties > 0 && (
            <span className="text-red-400 font-semibold flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" />
              <span>-{totalPenalties} {language === 'hi' ? 'अंक' : language === 'sat' ? 'ᱱᱚᱢᱵᱚᱨ' : 'pts'}</span>
            </span>
          )}
        </div>
        <ProgressBar
          value={progressPercent}
          showPercent={false}
          size="sm"
          color={session.isCompleted ? 'emerald' : 'amber'}
        />
      </div>

      {/* Compact Step Objective */}
      {currentStep && !session.isCompleted && (
        <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 leading-snug">
          <span className="font-bold text-amber-300 block">{localized?.title || currentStep.title}</span>
          <p className="text-[10px] text-slate-400 line-clamp-2">{localized?.objective || currentStep.objective}</p>
        </div>
      )}
    </div>
  );
}

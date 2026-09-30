import { useState } from 'react';
import { TrainingStep, SafetyAction } from '../../types/trainingEngine';
import { useTranslation } from '../../i18n/I18nContext';
import { getLocalizedStep, getLocalizedAction } from '../../i18n/trainingTranslations';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Play, SkipForward, AlertTriangle, ChevronUp, ChevronDown, ShieldCheck } from 'lucide-react';

export interface TrainingStepPanelProps {
  step: TrainingStep;
  onPerformAction: (action: SafetyAction) => void;
  onSkipStep: () => void;
  className?: string;
}

export function TrainingStepPanel({
  step,
  onPerformAction,
  onSkipStep,
  className = ''
}: TrainingStepPanelProps) {
  const { language, t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(
    step.allowedActions[0]?.id || null
  );
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);

  const localizedStep = getLocalizedStep(step, language);

  const handleExecute = () => {
    const action = step.allowedActions.find(a => a.id === selectedActionId);
    if (action) {
      onPerformAction(action);
    }
  };

  const handleConfirmSkip = () => {
    setIsSkipModalOpen(false);
    onSkipStep();
  };

  if (isCollapsed) {
    return (
      <div
        className={`bg-slate-950/80 backdrop-blur-md border border-slate-800/90 rounded-xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto text-xs ${className}`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-white">
            {language === 'hi' ? 'कार्य' : language === 'sat' ? 'ᱠᱟᱹᱢᱤ' : 'Action'}: {localizedStep.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleExecute}
            disabled={!selectedActionId}
            rightIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="text-xs py-1 h-7"
          >
            {t.executeAction}
          </Button>

          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Expand Actions"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-2xl space-y-3 text-left pointer-events-auto ${className}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {language === 'hi'
                  ? 'उपलब्ध सुरक्षा प्रोटोकॉल'
                  : language === 'sat'
                  ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ (Protocols)'
                  : 'Available Safety Protocols'}
              </span>
              <Badge variant="mining" size="sm">
                {language === 'hi' ? `चरण ${step.stepNumber}` : language === 'sat' ? `ᱫᱷᱟᱯ ${step.stepNumber}` : `Step ${step.stepNumber}`}
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-white leading-tight">{localizedStep.title}</h3>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            title="Minimize panel"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Selectable Actions List */}
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {step.allowedActions.map((action) => {
            const isSelected = selectedActionId === action.id;
            const localizedAction = getLocalizedAction(step.id, action, language);
            return (
              <div
                key={action.id}
                onClick={() => setSelectedActionId(action.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-slate-600'}`} />
                      <span className={isSelected ? 'text-amber-300' : 'text-slate-200'}>
                        {localizedAction.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 pl-3.5 leading-relaxed">
                      {localizedAction.description}
                    </p>
                  </div>
                  <Badge variant={action.isSafe ? 'success' : 'danger'} size="sm">
                    {action.actionType.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Execution & Skip Toolbar */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSkipModalOpen(true)}
            leftIcon={<SkipForward className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs text-slate-400 hover:text-slate-200 py-1"
          >
            {t.skipStep}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExecute}
            disabled={!selectedActionId}
            rightIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="shrink-0 text-xs"
          >
            {t.executeAction}
          </Button>
        </div>
      </div>

      {/* Skip Step Confirmation Modal */}
      <Modal
        isOpen={isSkipModalOpen}
        onClose={() => setIsSkipModalOpen(false)}
        title={language === 'hi' ? 'चरण छोड़ना की पुष्टि करें' : language === 'sat' ? 'ᱫᱷᱟᱯ ᱵᱟᱹᱜᱤ ᱴᱷᱟᱹᱣᱠᱟᱹ' : 'Confirm Step Skip'}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsSkipModalOpen(false)}>
              {t.cancel}
            </Button>
            <Button variant="warning" size="sm" onClick={handleConfirmSkip}>
              {t.confirm} (-10 {language === 'hi' ? 'अंक' : language === 'sat' ? 'ᱱᱚᱢᱵᱚᱨ' : 'Pts'})
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              {language === 'hi'
                ? `"${localizedStep.title}" छोड़ने पर आपके रिकॉर्ड पर -10 अंक का जुर्माना लगाया जाएगा।`
                : language === 'sat'
                ? `"${localizedStep.title}" ᱵᱟᱹᱜᱤ ᱞᱮᱠᱷᱟᱱ -᱑᱐ ᱱᱚᱢᱵᱚᱨ ᱠᱟᱴᱟᱣ ᱦᱩᱭᱩᱜ-ᱟ᱾`
                : `Skipping "${localizedStep.title}" will incur a -10 point score penalty.`}
            </p>
          </div>
          <p className="text-slate-300">
            {language === 'hi' ? 'क्या आप निश्चित रूप से इस प्रक्रिया को छोड़ना चाहते हैं?' : language === 'sat' ? 'ᱪᱮᱫ ᱟᱢ ᱱᱚᱣᱟ ᱫᱷᱟᱯ ᱵᱟᱹᱜᱤ ᱥᱟᱱᱟᱢ ᱠᱟᱱᱟ?' : 'Are you sure you wish to bypass this procedure?'}
          </p>
        </div>
      </Modal>
    </>
  );
}

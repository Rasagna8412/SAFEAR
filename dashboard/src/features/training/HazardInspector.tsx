import { HazardDefinition, InteractiveObjectDefinition } from '../../types/training';
import { InteractiveHitResult } from '../../training/interaction/ObjectInteraction';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  AlertTriangle,
  ShieldCheck,
  Zap,
  Box,
  Eye,
  X,
  Target
} from 'lucide-react';

export interface HazardInspectorProps {
  selectedHit: InteractiveHitResult | null;
  onClose: () => void;
  onFocus: (point: { x: number; y: number; z: number }) => void;
}

export function HazardInspector({
  selectedHit,
  onClose,
  onFocus
}: HazardInspectorProps) {
  if (!selectedHit) return null;

  const isHazard = selectedHit.type === 'HAZARD';
  const hazard = isHazard ? (selectedHit.data as HazardDefinition) : null;
  const equipment = !isHazard ? (selectedHit.data as InteractiveObjectDefinition) : null;

  const severityVariant = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'danger',
    CRITICAL: 'danger'
  } as const;

  return (
    <div
      className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-2xl z-20 animate-in slide-in-from-bottom-4 duration-150 space-y-4"
      role="region"
      aria-label="Object Inspector"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl border ${
              isHazard
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {isHazard ? <AlertTriangle className="w-5 h-5" /> : <Box className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isHazard ? 'Hazard Identified' : 'Interactive Equipment'}
            </span>
            <h3 className="text-sm font-bold text-slate-100">
              {isHazard ? hazard?.title : equipment?.title}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="space-y-3 text-xs leading-relaxed">
        {/* Severity & Type Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {isHazard && hazard && (
            <Badge variant={severityVariant[hazard.severity]} size="sm">
              Severity: {hazard.severity}
            </Badge>
          )}
          <Badge variant="default" size="sm">
            {isHazard ? hazard?.type : equipment?.type}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-slate-300">
          {isHazard ? hazard?.description : equipment?.description}
        </p>

        {/* Hazard Specific Details */}
        {isHazard && hazard && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-red-400 text-[11px]">
              <Zap className="w-3.5 h-3.5" />
              <span>Safe Working Distance: &ge; {hazard.safeDistanceRadius}m</span>
            </div>
            <p className="text-[11px] text-red-200/90">{hazard.warningText}</p>
            <p className="text-[11px] text-slate-300 pt-1 border-t border-red-900/50">
              <strong className="text-red-300">Precaution:</strong> {hazard.requiredPrecaution}
            </p>
          </div>
        )}

        {/* Equipment Specific Details */}
        {!isHazard && equipment && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Interactive Action:</span>
            </div>
            <p className="text-[11px] text-slate-300">{equipment.actionHint}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => onFocus(selectedHit.point)}
          leftIcon={<Target className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Focus In View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onClose}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

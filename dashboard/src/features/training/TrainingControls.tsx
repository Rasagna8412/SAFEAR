import { TrainingMode, CameraPermissionStatus } from '../../types/training';
import { useTranslation } from '../../i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Camera, Box, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface TrainingControlsProps {
  mode: TrainingMode;
  onModeChange: (mode: TrainingMode) => void;
  onResetCamera: () => void;
  cameraStatus: CameraPermissionStatus;
  hazardCount: number;
  objectCount: number;
  className?: string;
}

export function TrainingControls({
  mode,
  onModeChange,
  onResetCamera,
  cameraStatus,
  hazardCount,
  objectCount,
  className = ''
}: TrainingControlsProps) {
  const { language } = useTranslation();

  return (
    <div
      className={`bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {/* Mode Switcher Buttons */}
      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <Button
          variant={mode === 'SIMULATION_3D' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('SIMULATION_3D')}
          leftIcon={<Box className="w-4 h-4" />}
          className="text-xs"
        >
          {language === 'hi' ? '3D सिमुलेशन मोड' : language === 'sat' ? '3D ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱢᱳᱰ' : '3D Simulation Mode'}
        </Button>

        <Button
          variant={mode === 'CAMERA_AR' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('CAMERA_AR')}
          leftIcon={<Camera className="w-4 h-4" />}
          className="text-xs"
        >
          {language === 'hi' ? 'कैमरा एआर मोड' : language === 'sat' ? 'ᱠᱮᱢᱨᱟ AR ᱢᱳᱰ' : 'Camera AR Mode'}
        </Button>
      </div>

      {/* Info Badges */}
      <div className="flex items-center gap-2.5 text-xs">
        <Badge variant="danger" size="sm" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
          {hazardCount} {language === 'hi' ? 'सक्रिय खतरे' : language === 'sat' ? 'ᱪᱟᱹᱞᱩ ᱵᱚᱛᱚᱨ' : 'Hazards Active'}
        </Badge>
        <Badge variant="info" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
          {objectCount} {language === 'hi' ? 'उपकरण' : language === 'sat' ? 'ᱥᱟᱢᱟᱱ' : 'Interactive Items'}
        </Badge>
        {mode === 'CAMERA_AR' && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Camera: {cameraStatus}
          </span>
        )}
      </div>

      {/* View Reset Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetCamera}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          {language === 'hi' ? 'कैमरा रीसेट करें' : language === 'sat' ? 'ᱫᱚᱲᱦᱟ ᱧᱮᱞ' : 'Reset View'}
        </Button>
      </div>
    </div>
  );
}

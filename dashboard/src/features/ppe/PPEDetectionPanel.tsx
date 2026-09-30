import { useState, useEffect, useRef } from 'react';
import { PPEDetector } from '../../training/ppe/PPEDetector';
import { PPETrainingValidator } from '../../training/ppe/PPETrainingValidator';
import { PPEDetectionResult, PPEValidationResult, PPEModelStatus } from '../../types/ppe';
import { PPEItemStatus } from './PPEItemStatus';
import { PPEConfidenceIndicator } from './PPEConfidenceIndicator';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Camera,
  Scan,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface PPEDetectionPanelProps {
  isARMode: boolean;
  videoElement: HTMLVideoElement | null;
  onPPEVerified: (validation: PPEValidationResult) => void;
  onSwitchToCameraAR?: () => void;
  className?: string;
}

export function PPEDetectionPanel({
  isARMode,
  videoElement,
  onPPEVerified,
  onSwitchToCameraAR,
  className = ''
}: PPEDetectionPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modelStatus, setModelStatus] = useState<PPEModelStatus>('IDLE');
  const [isScanning, setIsScanning] = useState(false);
  const [lastDetection, setLastDetection] = useState<PPEDetectionResult | null>(null);
  const [lastValidation, setLastValidation] = useState<PPEValidationResult | null>(null);
  const detectorRef = useRef<PPEDetector | null>(null);

  useEffect(() => {
    const detector = new PPEDetector(false);
    detectorRef.current = detector;

    detector.onStatusChange((status) => {
      setModelStatus(status);
    });

    detector.initialize();

    return () => {
      detector.dispose();
      detectorRef.current = null;
    };
  }, []);

  const handleScan = async () => {
    if (!detectorRef.current || !videoElement) {
      // Fallback in simulation mode if video element is detached
      const fallbackDetector = new PPEDetector(true);
      await fallbackDetector.initialize();
      const simResult = await fallbackDetector.detect(videoElement as any);
      setLastDetection(simResult);
      const validation = PPETrainingValidator.validate(simResult);
      setLastValidation(validation);
      return;
    }

    setIsScanning(true);
    try {
      const result = await detectorRef.current.detect(videoElement);
      setLastDetection(result);
      const validation = PPETrainingValidator.validate(result);
      setLastValidation(validation);
    } catch {
      // Handle error
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmCompliance = () => {
    if (lastValidation) {
      onPPEVerified(lastValidation);
    }
  };

  if (isCollapsed) {
    return (
      <div
        className={`bg-slate-950/80 backdrop-blur-md border border-slate-800/90 rounded-xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto text-xs ${className}`}
      >
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-white">PPE Optical Scanner</span>
          {lastValidation && (
            <Badge variant={lastValidation.status === 'COMPLIANT' ? 'success' : 'warning'} size="sm">
              {lastValidation.status}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleScan}
            disabled={isScanning}
            leftIcon={isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scan className="w-3.5 h-3.5" />}
            className="text-xs py-1 h-7"
          >
            {isScanning ? 'Scanning...' : 'Scan PPE'}
          </Button>

          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Expand PPE Panel"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3D Simulation Mode Banner (Do NOT fake AI detection in 3D Mode!)
  if (!isARMode) {
    return (
      <div
        className={`bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-2xl space-y-2.5 text-left pointer-events-auto ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Eye className="w-4 h-4 shrink-0" />
            <h3 className="text-xs font-bold text-white">AI PPE Optical Scanner (Camera AR Required)</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          Switch to <strong>Camera AR Mode</strong> to perform live computer-vision verification of your hard hat, hi-vis vest, and gloves.
        </p>

        {onSwitchToCameraAR && (
          <Button
            variant="warning"
            size="sm"
            onClick={onSwitchToCameraAR}
            leftIcon={<Camera className="w-3.5 h-3.5" />}
            className="w-full text-xs"
          >
            Switch to Camera AR for PPE Scan
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-2xl space-y-3 text-left pointer-events-auto ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
              Computer Vision Subsystem
            </span>
            <h3 className="text-xs font-bold text-white leading-tight">
              Mandatory PPE Optical Scan
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              modelStatus === 'READY' ? 'success' : modelStatus === 'LOADING' ? 'warning' : 'default'
            }
            size="sm"
          >
            {modelStatus}
          </Badge>

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Minimize to see full camera feed"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detected Items Grid */}
      {lastDetection && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-[11px]">PPE Checklist:</span>
            <PPEConfidenceIndicator
              confidence={lastDetection.overallConfidence}
              size="sm"
              className="w-28"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
            {lastDetection.items.map((item) => (
              <PPEItemStatus key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Validation Result Alert */}
      {lastValidation && (
        <div
          className={`p-2.5 rounded-xl border text-xs space-y-1 ${
            lastValidation.status === 'COMPLIANT'
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100'
              : lastValidation.status === 'UNCERTAIN'
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-100'
              : 'bg-red-950/80 border-red-500/60 text-red-100'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold text-xs">
            {lastValidation.status === 'COMPLIANT' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {lastValidation.status === 'UNCERTAIN' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            {lastValidation.status === 'NON_COMPLIANT' && <XCircle className="w-3.5 h-3.5 text-red-400" />}
            <span>Status: {lastValidation.status.replace('_', ' ')}</span>
          </div>
          <p className="text-[10px] leading-relaxed">{lastValidation.message}</p>
        </div>
      )}

      {/* Scan & Confirm Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleScan}
          disabled={isScanning || modelStatus === 'LOADING'}
          leftIcon={
            isScanning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Scan className="w-3.5 h-3.5" />
            )
          }
          className="text-xs"
        >
          {isScanning ? 'Analyzing...' : 'Scan Video Feed'}
        </Button>

        {lastValidation?.canAdvance ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmCompliance}
            rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Verify &amp; Proceed
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleScan}
            disabled={!lastValidation}
            leftIcon={<RefreshCw className="w-3 h-3" />}
            className="text-[11px] text-slate-400 hover:text-slate-200 py-1"
          >
            Retry Scan (0 Penalty)
          </Button>
        )}
      </div>
    </div>
  );
}

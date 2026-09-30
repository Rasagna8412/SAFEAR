import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/I18nContext';
import { getScenarioById, MINING_SAFETY_SCENARIO } from '../../data/scenariosData';
import { TrainingMode, CameraPermissionStatus } from '../../types/training';
import { TrainingSession, ActionValidationResult, SafetyAction } from '../../types/trainingEngine';
import { PPEValidationResult } from '../../types/ppe';
import { TrainingEngine } from '../../training/engine/TrainingEngine';
import { SceneManager } from '../../training/scene/SceneManager';
import { CameraARManager } from '../../training/camera/CameraARManager';
import { InteractiveHitResult } from '../../training/interaction/ObjectInteraction';
import { TrainingControls } from './TrainingControls';
import { TrainingHUD } from './TrainingHUD';
import { TrainingStepPanel } from './TrainingStepPanel';
import { ActionFeedback } from './ActionFeedback';
import { TrainingCompletion } from './TrainingCompletion';
import { HazardInspector } from './HazardInspector';
import { PPEDetectionPanel } from '../ppe/PPEDetectionPanel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  Camera,
  Box,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

export function TrainingViewer() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { language } = useTranslation();

  const scenario = getScenarioById(scenarioId || '') || MINING_SAFETY_SCENARIO;

  // Initialize TrainingEngine
  const trainingEngine = useMemo(() => new TrainingEngine(scenario), [scenario]);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sceneManagerRef = useRef<SceneManager | null>(null);
  const cameraManagerRef = useRef<CameraARManager | null>(null);

  const [mode, setMode] = useState<TrainingMode>('SIMULATION_3D');
  const [cameraStatus, setCameraStatus] = useState<CameraPermissionStatus>('IDLE');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedHit, setSelectedHit] = useState<InteractiveHitResult | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [session, setSession] = useState<TrainingSession>(trainingEngine.getSession());
  const [lastValidation, setLastValidation] = useState<ActionValidationResult | undefined>(
    trainingEngine.getLastValidation()
  );

  // Subscribe to Training Engine
  useEffect(() => {
    const unsubscribeEngine = trainingEngine.subscribe((newSession, validation) => {
      setSession(newSession);
      setLastValidation(validation);
    });
    return () => unsubscribeEngine();
  }, [trainingEngine]);

  // Initialize SceneManager
  useEffect(() => {
    if (!containerRef.current) return;

    const sceneManager = new SceneManager({
      container: containerRef.current,
      scenario: scenario,
      isAROverlay: mode === 'CAMERA_AR',
      onObjectSelected: (hit) => {
        setSelectedHit(hit);
        if (hit.type === 'HAZARD') {
          trainingEngine.handleHazardSelection(hit.data.id);
        } else {
          trainingEngine.handleObjectSelection(hit.data.id);
        }
      }
    });

    sceneManagerRef.current = sceneManager;

    const cameraManager = new CameraARManager();
    cameraManagerRef.current = cameraManager;

    const unsubscribeCamera = cameraManager.onStatusChange((status, err) => {
      setCameraStatus(status);
      setCameraError(err);
    });

    return () => {
      unsubscribeCamera();
      cameraManager.dispose();
      sceneManager.dispose();
      sceneManagerRef.current = null;
      cameraManagerRef.current = null;
    };
  }, [scenario, trainingEngine]);

  // Handle Mode Changes
  const handleModeChange = async (newMode: TrainingMode) => {
    setMode(newMode);
    if (!sceneManagerRef.current || !cameraManagerRef.current) return;

    if (newMode === 'CAMERA_AR') {
      sceneManagerRef.current.setARMode(true);
      await cameraManagerRef.current.startCamera(videoRef.current);
    } else {
      sceneManagerRef.current.setARMode(false);
      cameraManagerRef.current.stopCamera(videoRef.current);
    }
  };

  const handleResetCamera = () => {
    sceneManagerRef.current?.resetCamera();
  };

  const handleFocusObject = (point: { x: number; y: number; z: number }) => {
    sceneManagerRef.current?.focusOnObject(point);
  };

  const handlePerformAction = (action: SafetyAction) => {
    trainingEngine.executeAction(action);
  };

  const handlePPEVerified = (validation: PPEValidationResult) => {
    if (validation.canAdvance) {
      trainingEngine.executeAction({
        id: 'act_equip_ppe',
        title: 'Equip Mandatory PPE',
        description: 'Certified Hard Hat, Hi-Vis Vest, Gloves, Eye Protection',
        actionType: 'EQUIP_PPE',
        isSafe: true
      });
    }
  };

  const handleSkipStep = () => {
    trainingEngine.skipStep();
    setSelectedHit(null);
  };

  const handleAdvanceStep = () => {
    trainingEngine.advanceStep();
    setSelectedHit(null);
  };

  const handleRetryStep = () => {
    trainingEngine.retry();
  };

  const handleRestartDrill = () => {
    trainingEngine.reset();
    setSelectedHit(null);
  };

  const currentStep = trainingEngine.getCurrentStep();
  const isPPEStep = currentStep?.id === 'step_01_ppe' || currentStep?.id === 'step_ppe_verification';

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[640px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col lg:flex-row">
      {/* 
        ============================================================
        LEFT MAIN AREA: 100% CLEAN 3D & CAMERA AR VIEWPORT
        Zero popups or overlapping protocol boxes over the camera
        ============================================================
      */}
      <div className="relative flex-1 h-[45vh] lg:h-full overflow-hidden bg-slate-950">
        {/* Background Live Video for Camera AR Mode */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
            mode === 'CAMERA_AR' && cameraStatus === 'GRANTED' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Three.js 3D WebGL Viewport Canvas */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full z-10 focus:outline-none"
          tabIndex={0}
          aria-label="3D Training Simulator Canvas"
        />

        {/* Minimalist Top Control Bar (Never blocks central 3D/Camera view) */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/courses')}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              className="bg-slate-950/80 backdrop-blur-md border-slate-700 text-xs py-1 h-7"
            >
              {language === 'hi' ? 'ड्रिल से बाहर निकलें' : language === 'sat' ? 'ᱰᱨᱤᱞ ᱠᱷᱚᱱ ᱵᱟᱦᱨᱮ' : 'Exit Drill'}
            </Button>

            <Badge
              variant={mode === 'CAMERA_AR' ? 'warning' : 'info'}
              size="sm"
              icon={mode === 'CAMERA_AR' ? <Camera className="w-3 h-3" /> : <Box className="w-3 h-3" />}
            >
              {mode === 'CAMERA_AR'
                ? (language === 'hi' ? 'कैमरा एआर मोड' : language === 'sat' ? 'ᱠᱮᱢᱨᱟ AR ᱢᱳᱰ' : 'Camera AR Mode')
                : (language === 'hi' ? '3D सिमुलेशन मोड' : language === 'sat' ? '3D ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱢᱳᱰ' : '3D Simulation Mode')}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowInstructions(!showInstructions)}
              leftIcon={<HelpCircle className="w-3.5 h-3.5 text-amber-400" />}
              className="bg-slate-950/80 backdrop-blur-md border-slate-700 text-xs py-1 h-7"
              title="Drill Guide"
            >
              {language === 'hi' ? 'मदद' : language === 'sat' ? 'ᱜᱚᱲᱚ' : 'Help'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              leftIcon={isSidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5 text-amber-400" />}
              className="bg-slate-950/80 backdrop-blur-md border-slate-700 text-xs py-1 h-7 hidden lg:flex"
              title={isSidebarOpen ? 'Hide Controls (Full Screen)' : 'Show Controls'}
            >
              {isSidebarOpen
                ? (language === 'hi' ? 'पूर्ण स्क्रीन 3D' : language === 'sat' ? 'ᱯᱩᱨᱟᱹ ᱥᱠᱨᱤᱱ 3D' : 'Fullscreen 3D')
                : (language === 'hi' ? 'पैनल दिखाएं' : language === 'sat' ? 'ᱯᱮᱱᱮᱞ ᱧᱮᱞ' : 'Show Panel')}
            </Button>
          </div>
        </div>

        {/* Camera Failure Fallback Notice */}
        {mode === 'CAMERA_AR' && (cameraStatus === 'DENIED' || cameraStatus === 'UNAVAILABLE' || cameraStatus === 'ERROR') && (
          <div className="absolute top-14 left-4 right-4 max-w-sm z-30 animate-in fade-in duration-150 pointer-events-auto">
            <div className="bg-amber-950/90 backdrop-blur-md border border-amber-500/60 rounded-xl p-3 shadow-xl text-slate-200 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-amber-300">Camera Feed Unavailable</h4>
                  <p className="text-[10px] text-amber-200/90 leading-tight">
                    {cameraError || 'Camera permission was denied. Tap below to switch.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-amber-800/60">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  leftIcon={<Box className="w-3.5 h-3.5" />}
                  onClick={() => handleModeChange('SIMULATION_3D')}
                  className="text-xs py-1 h-7"
                >
                  Switch to 3D Mode
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCw className="w-3 h-3" />}
                  onClick={() => handleModeChange('CAMERA_AR')}
                  className="border-amber-700 text-amber-200 text-xs py-1 h-7"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Guide Popup */}
        {showInstructions && (
          <div className="absolute top-14 right-4 max-w-xs z-30 animate-in fade-in duration-150 pointer-events-auto">
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 shadow-2xl space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <h4 className="font-bold text-slate-100 text-xs">Drill Instructions</h4>
                <button onClick={() => setShowInstructions(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <ul className="space-y-1 list-disc pl-3 text-[10px]">
                <li>Orbit &amp; inspect hazards in the 3D scene directly.</li>
                <li>Execute protocols using the side panel on the right.</li>
                <li>Tap 3D equipment to highlight diagnostic tags.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Interactive Object / Hazard Inspector Drawer */}
        <HazardInspector
          selectedHit={selectedHit}
          onClose={() => setSelectedHit(null)}
          onFocus={handleFocusObject}
        />
      </div>

      {/* 
        ============================================================
        RIGHT DEDICATED CONTROL PANEL (Side-by-Side Layout)
        Contains all Action Protocols, PPE Scanners, HUD & Toolbars
        so they NEVER block or overlay the Camera/3D Viewport
        ============================================================
      */}
      {isSidebarOpen && (
        <div className="w-full lg:w-[380px] xl:w-[420px] bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between gap-4 overflow-y-auto z-20 shadow-2xl shrink-0">
          {/* Top of Sidebar: HUD & Step Tracker */}
          <div className="space-y-4">
            <TrainingHUD session={session} currentStep={currentStep} />

            {/* Validation Feedback Banner */}
            {session.currentState === 'ACTION_VALIDATION' && lastValidation && (
              <ActionFeedback
                validation={lastValidation}
                onProceed={handleAdvanceStep}
                onRetry={handleRetryStep}
              />
            )}

            {/* Step 1: Optical PPE Subsystem or Protocol */}
            {isPPEStep && session.currentState !== 'ACTION_VALIDATION' && !session.isCompleted && (
              mode === 'CAMERA_AR' ? (
                <PPEDetectionPanel
                  isARMode={true}
                  videoElement={videoRef.current}
                  onPPEVerified={handlePPEVerified}
                  onSwitchToCameraAR={() => handleModeChange('CAMERA_AR')}
                />
              ) : (
                <TrainingStepPanel
                  step={currentStep!}
                  onPerformAction={handlePerformAction}
                  onSkipStep={handleSkipStep}
                />
              )
            )}

            {/* Steps 2-6: Step Action Protocols */}
            {!isPPEStep && session.currentState !== 'ACTION_VALIDATION' && !session.isCompleted && currentStep && (
              <TrainingStepPanel
                step={currentStep}
                onPerformAction={handlePerformAction}
                onSkipStep={handleSkipStep}
              />
            )}
          </div>

          {/* Bottom of Sidebar: Mode Switcher & Camera Reset Controls */}
          <div className="pt-3 border-t border-slate-800/80">
            <TrainingControls
              mode={mode}
              onModeChange={handleModeChange}
              onResetCamera={handleResetCamera}
              cameraStatus={cameraStatus}
              hazardCount={scenario.hazards.length}
              objectCount={scenario.objects.length}
            />
          </div>
        </div>
      )}

      {/* Completion Modal Overlay (Only when drill completes 100%) */}
      {session.isCompleted && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <TrainingCompletion
            session={session}
            scenarioTitle={scenario.title}
            onRestart={handleRestartDrill}
          />
        </div>
      )}
    </div>
  );
}

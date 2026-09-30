import { ScoreState } from './scoring';

export type TrainingState =
  | 'INTRO'
  | 'OBSERVE'
  | 'HAZARD_IDENTIFICATION'
  | 'SAFETY_ACTION'
  | 'ACTION_VALIDATION'
  | 'NEXT_STEP'
  | 'COMPLETED';

export type ActionValidationStatus = 'CORRECT' | 'INCORRECT' | 'UNSAFE' | 'INCOMPLETE';

export interface SafetyAction {
  id: string;
  title: string;
  description: string;
  actionType: 'INSPECT' | 'EQUIP_PPE' | 'ISOLATE_LOTO' | 'SET_PERIMETER' | 'TRIGGER_ESTOP' | 'EVACUATE' | 'UNSAFE_ACTION';
  isSafe: boolean;
  targetObjectId?: string;
  targetHazardId?: string;
}

export interface TrainingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  objective: string;
  targetHazardId?: string;
  targetObjectId?: string;
  requiredActionId: string;
  allowedActions: SafetyAction[];
  successMessage: string;
  failureMessage: string;
  unsafeMessage?: string;
  explanation: string;
}

export interface StepResult {
  stepId: string;
  stepNumber: number;
  selectedActionId?: string;
  selectedHazardId?: string;
  status: ActionValidationStatus | 'SKIPPED';
  feedbackMessage: string;
  penaltyDeducted: number;
  scoreAfterAction: number;
  timestamp: string;
  attemptsCount: number;
}

export interface TrainingSession {
  sessionId: string;
  scenarioId: string;
  userId?: string;
  currentState: TrainingState;
  currentStepIndex: number;
  totalSteps: number;
  startedAt: string;
  completedAt?: string;
  selectedActions: string[];
  identifiedHazards: string[];
  stepResults: StepResult[];
  scoreState: ScoreState;
  isCompleted: boolean;
}

export interface BaseValidationResult {
  status: ActionValidationStatus;
  message: string;
  stepCompleted: boolean;
  explanation: string;
  nextStepIndex?: number;
}

export interface ActionValidationResult {
  status: ActionValidationStatus | 'SKIPPED';
  message: string;
  stepCompleted: boolean;
  explanation: string;
  penaltyDeducted: number;
  currentScore: number;
  nextStepIndex?: number;
}

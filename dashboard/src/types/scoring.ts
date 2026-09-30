import { ActionValidationStatus } from './trainingEngine';

export type ScoringEventType = ActionValidationStatus | 'WRONG_HAZARD' | 'SKIPPED';

export interface PenaltyRuleConfig {
  CORRECT: number;
  WRONG_HAZARD: number;
  WRONG_ACTION: number;
  UNSAFE_ACTION: number;
  SKIPPED_STEP: number;
  INCOMPLETE: number;
}

export interface ScoreHistoryEntry {
  stepId: string;
  stepNumber: number;
  actionId?: string;
  hazardId?: string;
  result: ScoringEventType;
  penalty: number;
  scoreBeforeAction: number;
  scoreAfterAction: number;
  reason: string;
  timestamp: string;
}

export interface ScoreState {
  startingScore: number;
  currentScore: number;
  totalPenalties: number;
  correctActions: number;
  incorrectActions: number;
  unsafeActions: number;
  skippedSteps: number;
  history: ScoreHistoryEntry[];
}

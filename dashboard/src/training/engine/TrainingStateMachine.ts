import {
  TrainingSession,
  TrainingStep,
  SafetyAction,
  StepResult,
  ActionValidationResult
} from '../../types/trainingEngine';
import { TrainingActionValidator } from './TrainingActionValidator';
import { ScoringEngine } from '../scoring/ScoringEngine';

export class TrainingStateMachine {
  private session: TrainingSession;
  private steps: TrainingStep[];
  private scoringEngine: ScoringEngine;
  private onStateChangeCallbacks: ((session: TrainingSession, lastValidation?: ActionValidationResult) => void)[] = [];
  private lastValidationResult?: ActionValidationResult;

  constructor(scenarioId: string, steps: TrainingStep[], userId?: string) {
    this.steps = steps;
    this.scoringEngine = new ScoringEngine();
    this.session = {
      sessionId: `trn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      scenarioId,
      userId,
      currentState: 'INTRO',
      currentStepIndex: 0,
      totalSteps: steps.length,
      startedAt: new Date().toISOString(),
      selectedActions: [],
      identifiedHazards: [],
      stepResults: [],
      scoreState: this.scoringEngine.getState(),
      isCompleted: false
    };
  }

  public getSession(): TrainingSession {
    return {
      ...this.session,
      scoreState: this.scoringEngine.getState()
    };
  }

  public getCurrentStep(): TrainingStep | null {
    if (this.session.currentStepIndex >= this.steps.length) {
      return null;
    }
    return this.steps[this.session.currentStepIndex];
  }

  public getLastValidation(): ActionValidationResult | undefined {
    return this.lastValidationResult;
  }

  public subscribe(callback: (session: TrainingSession, lastValidation?: ActionValidationResult) => void): () => void {
    this.onStateChangeCallbacks.push(callback);
    callback(this.getSession(), this.lastValidationResult);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  private notify(): void {
    const sessionSnapshot = this.getSession();
    for (const callback of this.onStateChangeCallbacks) {
      callback(sessionSnapshot, this.lastValidationResult);
    }
  }

  public startTraining(): void {
    if (this.session.currentState === 'INTRO') {
      this.session.currentState = 'OBSERVE';
      this.notify();
    }
  }

  public proceedToHazardIdentification(): void {
    if (this.session.currentState === 'OBSERVE') {
      this.session.currentState = 'HAZARD_IDENTIFICATION';
      this.notify();
    }
  }

  public selectHazard(hazardId: string): ActionValidationResult {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      throw new Error('No active training step.');
    }

    const baseValidation = TrainingActionValidator.validateHazardSelection(currentStep, hazardId);
    const isCorrect = baseValidation.status === 'CORRECT';

    const scoreEntry = this.scoringEngine.applyHazardResult(
      currentStep.id,
      currentStep.stepNumber,
      hazardId,
      isCorrect,
      baseValidation.message
    );

    const validation: ActionValidationResult = {
      ...baseValidation,
      penaltyDeducted: scoreEntry.penalty,
      currentScore: scoreEntry.scoreAfterAction
    };

    this.lastValidationResult = validation;

    if (isCorrect) {
      if (!this.session.identifiedHazards.includes(hazardId)) {
        this.session.identifiedHazards.push(hazardId);
      }
      this.session.currentState = 'SAFETY_ACTION';
    } else {
      this.session.currentState = 'ACTION_VALIDATION';
    }

    this.notify();
    return validation;
  }

  public selectObject(objectId: string): void {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    if (currentStep.targetObjectId === objectId) {
      this.session.currentState = 'SAFETY_ACTION';
      this.notify();
    }
  }

  public performAction(action: SafetyAction): ActionValidationResult {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      throw new Error('No active training step.');
    }

    this.session.selectedActions.push(action.id);
    const baseValidation = TrainingActionValidator.validateAction(currentStep, action);

    // Apply scoring calculation
    const scoreEntry = this.scoringEngine.applyActionResult(
      currentStep.id,
      currentStep.stepNumber,
      action.id,
      baseValidation.status,
      baseValidation.message
    );

    const validation: ActionValidationResult = {
      ...baseValidation,
      penaltyDeducted: scoreEntry.penalty,
      currentScore: scoreEntry.scoreAfterAction
    };

    this.lastValidationResult = validation;

    // Record step result in session
    const stepResult: StepResult = {
      stepId: currentStep.id,
      stepNumber: currentStep.stepNumber,
      selectedActionId: action.id,
      selectedHazardId: currentStep.targetHazardId,
      status: validation.status,
      feedbackMessage: validation.message,
      penaltyDeducted: scoreEntry.penalty,
      scoreAfterAction: scoreEntry.scoreAfterAction,
      timestamp: new Date().toISOString(),
      attemptsCount: this.session.stepResults.filter(r => r.stepId === currentStep.id).length + 1
    };
    this.session.stepResults.push(stepResult);

    this.session.currentState = 'ACTION_VALIDATION';

    if (validation.status === 'CORRECT') {
      if (this.session.currentStepIndex + 1 >= this.steps.length) {
        this.session.isCompleted = true;
        this.session.completedAt = new Date().toISOString();
        this.session.currentState = 'COMPLETED';
      }
    }

    this.notify();
    return validation;
  }

  public skipCurrentStep(): ActionValidationResult {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      throw new Error('No active training step.');
    }

    const scoreEntry = this.scoringEngine.applySkippedStep(
      currentStep.id,
      currentStep.stepNumber,
      `Step ${currentStep.stepNumber} skipped by trainee`
    );

    const validation: ActionValidationResult = {
      status: 'SKIPPED',
      message: `Step ${currentStep.stepNumber} skipped. Penalty: -${scoreEntry.penalty} points.`,
      stepCompleted: true,
      explanation: currentStep.explanation,
      penaltyDeducted: scoreEntry.penalty,
      currentScore: scoreEntry.scoreAfterAction
    };

    this.lastValidationResult = validation;

    const stepResult: StepResult = {
      stepId: currentStep.id,
      stepNumber: currentStep.stepNumber,
      status: 'SKIPPED',
      feedbackMessage: validation.message,
      penaltyDeducted: scoreEntry.penalty,
      scoreAfterAction: scoreEntry.scoreAfterAction,
      timestamp: new Date().toISOString(),
      attemptsCount: 1
    };
    this.session.stepResults.push(stepResult);

    if (this.session.currentStepIndex + 1 >= this.steps.length) {
      this.session.isCompleted = true;
      this.session.completedAt = new Date().toISOString();
      this.session.currentState = 'COMPLETED';
    } else {
      this.session.currentState = 'ACTION_VALIDATION';
    }

    this.notify();
    return validation;
  }

  public retryCurrentStep(): void {
    // Retry allows the user to re-attempt the step without deducting an extra retry fee
    if (this.session.currentState === 'ACTION_VALIDATION') {
      this.lastValidationResult = undefined;
      this.session.currentState = 'SAFETY_ACTION';
      this.notify();
    }
  }

  public nextStep(): void {
    if (this.session.isCompleted) {
      this.session.currentState = 'COMPLETED';
      this.notify();
      return;
    }

    if (this.session.currentStepIndex + 1 < this.steps.length) {
      this.session.currentStepIndex += 1;
      this.lastValidationResult = undefined;
      this.session.currentState = 'OBSERVE';
      this.notify();
    } else {
      this.session.isCompleted = true;
      this.session.completedAt = new Date().toISOString();
      this.session.currentState = 'COMPLETED';
      this.notify();
    }
  }

  public resetSession(): void {
    this.scoringEngine.reset();
    this.session = {
      sessionId: `trn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      scenarioId: this.session.scenarioId,
      userId: this.session.userId,
      currentState: 'INTRO',
      currentStepIndex: 0,
      totalSteps: this.steps.length,
      startedAt: new Date().toISOString(),
      selectedActions: [],
      identifiedHazards: [],
      stepResults: [],
      scoreState: this.scoringEngine.getState(),
      isCompleted: false
    };
    this.lastValidationResult = undefined;
    this.notify();
  }
}

import { TrainingScenario } from '../../types/training';
import { TrainingStep, TrainingSession, SafetyAction, ActionValidationResult } from '../../types/trainingEngine';
import { ScoreState } from '../../types/scoring';
import { MINING_TRAINING_STEPS } from '../data/miningTrainingSteps';
import { TrainingStateMachine } from './TrainingStateMachine';

export class TrainingEngine {
  private scenario: TrainingScenario;
  private stateMachine: TrainingStateMachine;

  constructor(scenario: TrainingScenario, userId?: string) {
    this.scenario = scenario;
    const steps = this.loadStepsForScenario(scenario.id);
    this.stateMachine = new TrainingStateMachine(scenario.id, steps, userId);
  }

  private loadStepsForScenario(scenarioId: string): TrainingStep[] {
    if (scenarioId === 'mining-basic-scene' || scenarioId.startsWith('mining')) {
      return MINING_TRAINING_STEPS;
    }
    return MINING_TRAINING_STEPS;
  }

  public getScenario(): TrainingScenario {
    return this.scenario;
  }

  public getSession(): TrainingSession {
    return this.stateMachine.getSession();
  }

  public getScoreState(): ScoreState {
    return this.stateMachine.getSession().scoreState;
  }

  public getCurrentStep(): TrainingStep | null {
    return this.stateMachine.getCurrentStep();
  }

  public getLastValidation(): ActionValidationResult | undefined {
    return this.stateMachine.getLastValidation();
  }

  public subscribe(callback: (session: TrainingSession, lastValidation?: ActionValidationResult) => void): () => void {
    return this.stateMachine.subscribe(callback);
  }

  public start(): void {
    this.stateMachine.startTraining();
  }

  public proceedToHazardIdentification(): void {
    this.stateMachine.proceedToHazardIdentification();
  }

  public handleHazardSelection(hazardId: string): ActionValidationResult {
    return this.stateMachine.selectHazard(hazardId);
  }

  public handleObjectSelection(objectId: string): void {
    this.stateMachine.selectObject(objectId);
  }

  public executeAction(action: SafetyAction): ActionValidationResult {
    return this.stateMachine.performAction(action);
  }

  public skipStep(): ActionValidationResult {
    return this.stateMachine.skipCurrentStep();
  }

  public retry(): void {
    this.stateMachine.retryCurrentStep();
  }

  public advanceStep(): void {
    this.stateMachine.nextStep();
  }

  public reset(): void {
    this.stateMachine.resetSession();
  }
}

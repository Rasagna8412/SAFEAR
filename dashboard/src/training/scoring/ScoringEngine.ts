import { ScoreState, ScoreHistoryEntry } from '../../types/scoring';
import { ActionValidationStatus } from '../../types/trainingEngine';
import { SCORING_RULES, STARTING_SCORE, MIN_SCORE, MAX_SCORE } from './ScoringConfig';

export class ScoringEngine {
  private state: ScoreState;

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): ScoreState {
    return {
      startingScore: STARTING_SCORE,
      currentScore: STARTING_SCORE,
      totalPenalties: 0,
      correctActions: 0,
      incorrectActions: 0,
      unsafeActions: 0,
      skippedSteps: 0,
      history: []
    };
  }

  public getState(): ScoreState {
    return {
      ...this.state,
      history: [...this.state.history]
    };
  }

  public getCurrentScore(): number {
    return this.state.currentScore;
  }

  public applyActionResult(
    stepId: string,
    stepNumber: number,
    actionId: string,
    status: ActionValidationStatus,
    reason: string
  ): ScoreHistoryEntry {
    let penalty = 0;

    switch (status) {
      case 'CORRECT':
        penalty = SCORING_RULES.CORRECT;
        this.state.correctActions += 1;
        break;
      case 'UNSAFE':
        penalty = SCORING_RULES.UNSAFE_ACTION;
        this.state.unsafeActions += 1;
        break;
      case 'INCORRECT':
        penalty = SCORING_RULES.WRONG_ACTION;
        this.state.incorrectActions += 1;
        break;
      case 'INCOMPLETE':
        penalty = SCORING_RULES.INCOMPLETE;
        this.state.incorrectActions += 1;
        break;
    }

    const scoreBefore = this.state.currentScore;
    const scoreAfter = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scoreBefore - penalty));

    this.state.currentScore = scoreAfter;
    this.state.totalPenalties += penalty;

    const entry: ScoreHistoryEntry = {
      stepId,
      stepNumber,
      actionId,
      result: status,
      penalty,
      scoreBeforeAction: scoreBefore,
      scoreAfterAction: scoreAfter,
      reason,
      timestamp: new Date().toISOString()
    };

    this.state.history.push(entry);
    return entry;
  }

  public applyHazardResult(
    stepId: string,
    stepNumber: number,
    hazardId: string,
    isCorrect: boolean,
    reason: string
  ): ScoreHistoryEntry {
    const penalty = isCorrect ? SCORING_RULES.CORRECT : SCORING_RULES.WRONG_HAZARD;
    if (!isCorrect) {
      this.state.incorrectActions += 1;
    }

    const scoreBefore = this.state.currentScore;
    const scoreAfter = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scoreBefore - penalty));

    this.state.currentScore = scoreAfter;
    this.state.totalPenalties += penalty;

    const entry: ScoreHistoryEntry = {
      stepId,
      stepNumber,
      hazardId,
      result: isCorrect ? 'CORRECT' : 'WRONG_HAZARD',
      penalty,
      scoreBeforeAction: scoreBefore,
      scoreAfterAction: scoreAfter,
      reason,
      timestamp: new Date().toISOString()
    };

    this.state.history.push(entry);
    return entry;
  }

  public applySkippedStep(
    stepId: string,
    stepNumber: number,
    reason: string = 'Step skipped by trainee'
  ): ScoreHistoryEntry {
    const penalty = SCORING_RULES.SKIPPED_STEP;
    this.state.skippedSteps += 1;

    const scoreBefore = this.state.currentScore;
    const scoreAfter = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scoreBefore - penalty));

    this.state.currentScore = scoreAfter;
    this.state.totalPenalties += penalty;

    const entry: ScoreHistoryEntry = {
      stepId,
      stepNumber,
      result: 'SKIPPED',
      penalty,
      scoreBeforeAction: scoreBefore,
      scoreAfterAction: scoreAfter,
      reason,
      timestamp: new Date().toISOString()
    };

    this.state.history.push(entry);
    return entry;
  }

  public reset(): void {
    this.state = this.createInitialState();
  }
}

import { TrainingStep, SafetyAction, BaseValidationResult } from '../../types/trainingEngine';

export class TrainingActionValidator {
  public static validateAction(
    step: TrainingStep,
    action: SafetyAction
  ): BaseValidationResult {
    // 1. Check if the action is explicitly unsafe
    if (!action.isSafe || action.actionType === 'UNSAFE_ACTION') {
      return {
        status: 'UNSAFE',
        message: step.unsafeMessage || 'Unsafe action. Follow the indicated safety procedure.',
        stepCompleted: false,
        explanation: step.explanation
      };
    }

    // 2. Check if the action matches the required step action
    if (action.id === step.requiredActionId) {
      return {
        status: 'CORRECT',
        message: step.successMessage,
        stepCompleted: true,
        explanation: step.explanation,
        nextStepIndex: step.stepNumber // Step number is 1-indexed, so next index in array equals current stepNumber
      };
    }

    // 3. Check for incomplete or incorrect safe actions
    if (action.id.includes('partial') || action.id.includes('only')) {
      return {
        status: 'INCOMPLETE',
        message: 'Complete the required action before continuing.',
        stepCompleted: false,
        explanation: step.explanation
      };
    }

    return {
      status: 'INCORRECT',
      message: step.failureMessage || 'That is not the required safety action.',
      stepCompleted: false,
      explanation: step.explanation
    };
  }

  public static validateHazardSelection(
    step: TrainingStep,
    selectedHazardId: string
  ): BaseValidationResult {
    if (!step.targetHazardId) {
      return {
        status: 'INCORRECT',
        message: 'Current training step does not require hazard selection. Proceed with safety action.',
        stepCompleted: false,
        explanation: step.explanation
      };
    }

    if (selectedHazardId === step.targetHazardId) {
      return {
        status: 'CORRECT',
        message: `Correct hazard identified: ${step.title}`,
        stepCompleted: false,
        explanation: step.explanation
      };
    }

    return {
      status: 'INCORRECT',
      message: 'That is not the target hazard for this inspection step. Look for the hazard described in the objective.',
      stepCompleted: false,
      explanation: step.explanation
    };
  }
}

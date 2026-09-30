import { describe, it, expect, beforeEach } from 'vitest';
import { MINING_SAFETY_SCENARIO } from '../data/scenariosData';
import { MINING_TRAINING_STEPS } from '../training/data/miningTrainingSteps';
import { TrainingEngine } from '../training/engine/TrainingEngine';
import { TrainingStateMachine } from '../training/engine/TrainingStateMachine';
import { TrainingActionValidator } from '../training/engine/TrainingActionValidator';

describe('Phase 3 Interactive Safety Training Engine Tests', () => {
  let engine: TrainingEngine;
  let stateMachine: TrainingStateMachine;

  beforeEach(() => {
    engine = new TrainingEngine(MINING_SAFETY_SCENARIO, 'usr_test_worker');
    stateMachine = new TrainingStateMachine(MINING_SAFETY_SCENARIO.id, MINING_TRAINING_STEPS, 'usr_test_worker');
  });

  describe('1. State Machine & Initial State', () => {
    it('should initialize in INTRO state at step 0', () => {
      const session = stateMachine.getSession();
      expect(session.currentState).toBe('INTRO');
      expect(session.currentStepIndex).toBe(0);
      expect(session.totalSteps).toBe(6);
      expect(session.isCompleted).toBe(false);
    });

    it('should transition from INTRO to OBSERVE on start', () => {
      stateMachine.startTraining();
      expect(stateMachine.getSession().currentState).toBe('OBSERVE');
    });

    it('should transition from OBSERVE to HAZARD_IDENTIFICATION', () => {
      stateMachine.startTraining();
      stateMachine.proceedToHazardIdentification();
      expect(stateMachine.getSession().currentState).toBe('HAZARD_IDENTIFICATION');
    });
  });

  describe('2. Hazard Identification Validation', () => {
    it('should return CORRECT when selecting the target hazard for the step', () => {
      const step2 = MINING_TRAINING_STEPS[1]; // Target: hazard_elec_01
      const result = TrainingActionValidator.validateHazardSelection(step2, 'hazard_elec_01');

      expect(result.status).toBe('CORRECT');
      expect(result.message).toContain('Correct hazard identified');
    });

    it('should return INCORRECT when selecting an irrelevant hazard', () => {
      const step2 = MINING_TRAINING_STEPS[1];
      const result = TrainingActionValidator.validateHazardSelection(step2, 'hazard_machinery_02');

      expect(result.status).toBe('INCORRECT');
      expect(result.message).toContain('not the target hazard');
    });
  });

  describe('3. Safety Action Validation & Rules', () => {
    it('should validate correct mandatory PPE action on step 1', () => {
      const step1 = MINING_TRAINING_STEPS[0];
      const correctAction = step1.allowedActions.find(a => a.id === 'act_equip_ppe')!;
      const result = TrainingActionValidator.validateAction(step1, correctAction);

      expect(result.status).toBe('CORRECT');
      expect(result.stepCompleted).toBe(true);
      expect(result.message).toContain('Correct safety action');
    });

    it('should flag unsafe action with UNSAFE status and warning', () => {
      const step1 = MINING_TRAINING_STEPS[0];
      const unsafeAction = step1.allowedActions.find(a => a.id === 'act_bypass_ppe')!;
      const result = TrainingActionValidator.validateAction(step1, unsafeAction);

      expect(result.status).toBe('UNSAFE');
      expect(result.stepCompleted).toBe(false);
      expect(result.message).toContain('violates critical safety regulations');
    });

    it('should flag incomplete LOTO action as INCOMPLETE / incorrect', () => {
      const step3 = MINING_TRAINING_STEPS[2];
      const partialAction = step3.allowedActions.find(a => a.id === 'act_switch_off_only')!;
      const result = TrainingActionValidator.validateAction(step3, partialAction);

      expect(['INCOMPLETE', 'INCORRECT']).toContain(result.status);
      expect(result.stepCompleted).toBe(false);
    });
  });

  describe('4. Retry Behavior & Error Recovery', () => {
    it('should allow retrying an unsafe or incorrect action without getting stuck', () => {
      stateMachine.startTraining();
      const step1 = stateMachine.getCurrentStep()!;
      const unsafeAction = step1.allowedActions.find(a => a.id === 'act_bypass_ppe')!;

      // Execute unsafe action
      stateMachine.performAction(unsafeAction);
      expect(stateMachine.getSession().currentState).toBe('ACTION_VALIDATION');
      expect(stateMachine.getLastValidation()?.status).toBe('UNSAFE');

      // Retry
      stateMachine.retryCurrentStep();
      expect(stateMachine.getSession().currentState).toBe('SAFETY_ACTION');
      expect(stateMachine.getLastValidation()).toBeUndefined();

      // Execute correct action
      const correctAction = step1.allowedActions.find(a => a.id === 'act_equip_ppe')!;
      stateMachine.performAction(correctAction);
      expect(stateMachine.getLastValidation()?.status).toBe('CORRECT');
    });
  });

  describe('5. Full Step Progression & Completion State', () => {
    it('should advance through all 6 steps and reach COMPLETED state', () => {
      stateMachine.startTraining();

      for (let i = 0; i < MINING_TRAINING_STEPS.length; i++) {
        const step = stateMachine.getCurrentStep()!;
        expect(step.stepNumber).toBe(i + 1);

        const correctAction = step.allowedActions.find(a => a.id === step.requiredActionId)!;
        stateMachine.performAction(correctAction);

        if (i < MINING_TRAINING_STEPS.length - 1) {
          stateMachine.nextStep();
        }
      }

      const finalSession = stateMachine.getSession();
      expect(finalSession.isCompleted).toBe(true);
      expect(finalSession.currentState).toBe('COMPLETED');
      expect(finalSession.completedAt).toBeDefined();
      expect(finalSession.stepResults.length).toBe(6);
    });

    it('should reset session cleanly when requested', () => {
      stateMachine.startTraining();
      stateMachine.performAction(MINING_TRAINING_STEPS[0].allowedActions[0]);
      stateMachine.nextStep();

      expect(stateMachine.getSession().currentStepIndex).toBe(1);

      stateMachine.resetSession();
      expect(stateMachine.getSession().currentStepIndex).toBe(0);
      expect(stateMachine.getSession().currentState).toBe('INTRO');
      expect(stateMachine.getSession().selectedActions.length).toBe(0);
      expect(stateMachine.getSession().isCompleted).toBe(false);
    });
  });

  describe('6. Engine Unification & Mode Neutrality', () => {
    it('TrainingEngine should expose same session and step data to any view mode', () => {
      expect(engine.getSession().totalSteps).toBe(6);
      expect(engine.getCurrentStep()?.title).toBe('Mandatory PPE Verification');

      engine.start();
      expect(engine.getSession().currentState).toBe('OBSERVE');

      const step1 = engine.getCurrentStep()!;
      const correctAction = step1.allowedActions.find(a => a.id === step1.requiredActionId)!;
      const res = engine.executeAction(correctAction);
      expect(res.status).toBe('CORRECT');
    });

    it('should not contain numerical score or point deductions in Phase 3', () => {
      const session: any = engine.getSession();
      expect(session.score).toBeUndefined();
      expect(session.points).toBeUndefined();
      expect(session.penalty).toBeUndefined();
    });
  });
});

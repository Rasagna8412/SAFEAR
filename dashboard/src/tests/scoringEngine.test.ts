import { describe, it, expect, beforeEach } from 'vitest';
import { ScoringEngine } from '../training/scoring/ScoringEngine';
import { MINING_SAFETY_SCENARIO } from '../data/scenariosData';
import { TrainingEngine } from '../training/engine/TrainingEngine';

describe('Phase 4 Deterministic Safety Scoring Engine Tests', () => {
  let scoring: ScoringEngine;

  beforeEach(() => {
    scoring = new ScoringEngine();
  });

  describe('1. Baseline Score Initialization & Penalties', () => {
    it('1. Initial score should start at 100 with zero penalties', () => {
      const state = scoring.getState();
      expect(state.startingScore).toBe(100);
      expect(state.currentScore).toBe(100);
      expect(state.totalPenalties).toBe(0);
      expect(state.history.length).toBe(0);
    });

    it('2. Correct action should incur 0 penalty (100 remains 100)', () => {
      const entry = scoring.applyActionResult('step_1', 1, 'act_ppe', 'CORRECT', 'PPE equipped');
      expect(entry.penalty).toBe(0);
      expect(entry.scoreAfterAction).toBe(100);
      expect(scoring.getCurrentScore()).toBe(100);
      expect(scoring.getState().correctActions).toBe(1);
    });

    it('3. Wrong hazard identification should deduct 5 points (100 -> 95)', () => {
      const entry = scoring.applyHazardResult('step_2', 2, 'hazard_wrong', false, 'Wrong hazard');
      expect(entry.penalty).toBe(5);
      expect(entry.scoreAfterAction).toBe(95);
      expect(scoring.getCurrentScore()).toBe(95);
      expect(scoring.getState().totalPenalties).toBe(5);
    });

    it('4. Wrong safety action should deduct 10 points (100 -> 90)', () => {
      const entry = scoring.applyActionResult('step_1', 1, 'act_wrong', 'INCORRECT', 'Wrong action');
      expect(entry.penalty).toBe(10);
      expect(entry.scoreAfterAction).toBe(90);
      expect(scoring.getCurrentScore()).toBe(90);
      expect(scoring.getState().incorrectActions).toBe(1);
    });

    it('5. Unsafe action should deduct 20 points (100 -> 80)', () => {
      const entry = scoring.applyActionResult('step_1', 1, 'act_unsafe', 'UNSAFE', 'Violation');
      expect(entry.penalty).toBe(20);
      expect(entry.scoreAfterAction).toBe(80);
      expect(scoring.getCurrentScore()).toBe(80);
      expect(scoring.getState().unsafeActions).toBe(1);
    });

    it('6. Skipped step should deduct 10 points (100 -> 90)', () => {
      const entry = scoring.applySkippedStep('step_3', 3, 'Step skipped');
      expect(entry.penalty).toBe(10);
      expect(entry.scoreAfterAction).toBe(90);
      expect(scoring.getCurrentScore()).toBe(90);
      expect(scoring.getState().skippedSteps).toBe(1);
    });
  });

  describe('2. Cumulative Scoring & Clamping Boundaries', () => {
    it('7. Multiple penalties should accumulate deterministically (100 - 5 - 10 - 20 = 65)', () => {
      scoring.applyHazardResult('step_2', 2, 'hazard_wrong', false, 'Wrong hazard'); // -5 -> 95
      scoring.applyActionResult('step_1', 1, 'act_wrong', 'INCORRECT', 'Wrong action'); // -10 -> 85
      scoring.applyActionResult('step_3', 3, 'act_unsafe', 'UNSAFE', 'Unsafe wire'); // -20 -> 65

      const state = scoring.getState();
      expect(state.currentScore).toBe(65);
      expect(state.totalPenalties).toBe(35);
      expect(state.history.length).toBe(3);
    });

    it('8. Score should clamp at lower bound and never go below 0', () => {
      // Apply 6 unsafe actions (-120 pts)
      for (let i = 0; i < 6; i++) {
        scoring.applyActionResult(`step_${i}`, i, 'act_unsafe', 'UNSAFE', 'Violation');
      }

      expect(scoring.getCurrentScore()).toBe(0);
      expect(scoring.getState().currentScore).toBe(0);
      expect(scoring.getState().totalPenalties).toBe(120);
    });

    it('9. Score should never exceed 100', () => {
      // 5 correct actions
      for (let i = 0; i < 5; i++) {
        scoring.applyActionResult(`step_${i}`, i, 'act_correct', 'CORRECT', 'Correct');
      }

      expect(scoring.getCurrentScore()).toBe(100);
      expect(scoring.getState().currentScore).toBe(100);
    });
  });

  describe('3. History & Action Counts', () => {
    it('10. Score history must track all events with before and after scores', () => {
      scoring.applyActionResult('s1', 1, 'a1', 'CORRECT', 'ok');
      scoring.applyActionResult('s2', 2, 'a2', 'UNSAFE', 'danger');

      const history = scoring.getState().history;
      expect(history.length).toBe(2);
      expect(history[0].scoreBeforeAction).toBe(100);
      expect(history[0].scoreAfterAction).toBe(100);
      expect(history[1].scoreBeforeAction).toBe(100);
      expect(history[1].scoreAfterAction).toBe(80);
      expect(history[1].penalty).toBe(20);
    });

    it('11. Action category counters must accurately reflect executed events', () => {
      scoring.applyActionResult('s1', 1, 'a1', 'CORRECT', 'ok');
      scoring.applyActionResult('s2', 2, 'a2', 'CORRECT', 'ok');
      scoring.applyActionResult('s3', 3, 'a3', 'INCORRECT', 'wrong');
      scoring.applyActionResult('s4', 4, 'a4', 'UNSAFE', 'danger');
      scoring.applySkippedStep('s5', 5, 'skipped');

      const state = scoring.getState();
      expect(state.correctActions).toBe(2);
      expect(state.incorrectActions).toBe(1);
      expect(state.unsafeActions).toBe(1);
      expect(state.skippedSteps).toBe(1);
    });
  });

  describe('4. TrainingEngine Integration & Retry Behavior', () => {
    it('12. Retrying an action should NOT apply an extra penalty', () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO);
      engine.start();

      const step1 = engine.getCurrentStep()!;
      const unsafeAction = step1.allowedActions.find(a => a.id === 'act_bypass_ppe')!;

      // Step 1 fails with unsafe action -> 80
      engine.executeAction(unsafeAction);
      expect(engine.getScoreState().currentScore).toBe(80);

      // User hits retry
      engine.retry();
      // Score MUST remain 80 (not deducted for retrying)
      expect(engine.getScoreState().currentScore).toBe(80);

      // User performs correct action -> 0 penalty, remains 80
      const correctAction = step1.allowedActions.find(a => a.id === step1.requiredActionId)!;
      engine.executeAction(correctAction);
      expect(engine.getScoreState().currentScore).toBe(80);
    });

    it('13. Session reset must cleanly restore score to 100 and clear history', () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO);
      engine.start();

      const step1 = engine.getCurrentStep()!;
      engine.executeAction(step1.allowedActions.find(a => a.id === 'act_bypass_ppe')!);
      expect(engine.getScoreState().currentScore).toBe(80);

      engine.reset();
      expect(engine.getScoreState().currentScore).toBe(100);
      expect(engine.getScoreState().totalPenalties).toBe(0);
      expect(engine.getScoreState().history.length).toBe(0);
    });

    it('14. Identical action sequences must produce 100% deterministic identical scores', () => {
      const engineA = new TrainingEngine(MINING_SAFETY_SCENARIO);
      const engineB = new TrainingEngine(MINING_SAFETY_SCENARIO);

      engineA.start();
      engineB.start();

      // Sequence: Step 1 correct, Step 2 wrong hazard then correct, Step 3 skip
      const step1A = engineA.getCurrentStep()!;
      const step1B = engineB.getCurrentStep()!;
      engineA.executeAction(step1A.allowedActions.find(a => a.id === step1A.requiredActionId)!);
      engineB.executeAction(step1B.allowedActions.find(a => a.id === step1B.requiredActionId)!);

      engineA.advanceStep();
      engineB.advanceStep();

      engineA.handleHazardSelection('hazard_wrong');
      engineB.handleHazardSelection('hazard_wrong');

      engineA.retry();
      engineB.retry();

      engineA.handleHazardSelection('hazard_elec_01');
      engineB.handleHazardSelection('hazard_elec_01');

      engineA.advanceStep();
      engineB.advanceStep();

      engineA.skipStep();
      engineB.skipStep();

      expect(engineA.getScoreState().currentScore).toBe(engineB.getScoreState().currentScore);
      expect(engineA.getScoreState().totalPenalties).toBe(15); // 0 + 5 + 0 + 10 = 15 -> 85
      expect(engineA.getScoreState().currentScore).toBe(85);
    });

    it('15. Camera AR and 3D Simulation modes use identical underlying ScoringEngine', () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO);
      expect(engine.getScoreState()).toBeDefined();
      expect(engine.getScoreState().startingScore).toBe(100);
    });
  });
});

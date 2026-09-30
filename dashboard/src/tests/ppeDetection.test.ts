import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PPEDetector } from '../training/ppe/PPEDetector';
import { PPETrainingValidator } from '../training/ppe/PPETrainingValidator';
import { PPE_CONFIG, PPE_LABELS } from '../training/ppe/PPEConfig';
import { PPEDetectionResult } from '../types/ppe';
import { TrainingEngine } from '../training/engine/TrainingEngine';
import { MINING_SAFETY_SCENARIO } from '../data/scenariosData';

describe('Phase 6 AI PPE Verification & Computer Vision Pipeline Tests', () => {
  let detector: PPEDetector;

  beforeEach(async () => {
    detector = new PPEDetector(true); // Simulation detector for headless runner
    await detector.initialize();
  });

  afterEach(() => {
    detector.dispose();
  });

  describe('1. Model Lifecycle & Initialization', () => {
    it('1. IPPEDetector should initialize and transition to READY state', async () => {
      expect(detector.getStatus()).toBe('READY');
    });

    it('2. Detector status listener should receive lifecycle updates', async () => {
      const statuses: string[] = [];
      const testDetector = new PPEDetector(true);
      testDetector.onStatusChange(s => statuses.push(s));
      await testDetector.initialize();
      testDetector.dispose();

      expect(statuses).toContain('LOADING');
      expect(statuses).toContain('READY');
      expect(statuses).toContain('DISPOSED');
    });

    it('3. Detector dispose should release resources and mark DISPOSED', () => {
      detector.dispose();
      expect(detector.getStatus()).toBe('DISPOSED');
    });
  });

  describe('2. Detection Schema & Confidence Thresholds', () => {
    it('4. Centralized PPEConfig should enforce standard confidence boundaries', () => {
      expect(PPE_CONFIG.confidenceThreshold).toBe(0.70);
      expect(PPE_CONFIG.uncertainThreshold).toBe(0.45);
      expect(PPE_CONFIG.requiredMiningPPE).toEqual(['helmet', 'safetyVest', 'gloves', 'eyeProtection']);
    });

    it('5. Detection results should match strongly typed schema', async () => {
      const result = await detector.detect({} as any);
      expect(result.id).toMatch(/^ppe_/);
      expect(result.timestamp).toBeDefined();
      expect(result.items.length).toBe(4);
      expect(result.overallConfidence).toBeGreaterThanOrEqual(0.70);
      expect(result.isDevSimulation).toBe(true);
    });

    it('6. High-confidence item (>=0.70) must be flagged as CONFIRMED', () => {
      const mockResult: PPEDetectionResult = {
        id: 'ppe_test_1',
        timestamp: new Date().toISOString(),
        overallConfidence: 0.90,
        isDevSimulation: true,
        inferenceTimeMs: 12,
        items: [
          { id: '1', item: 'helmet', label: 'Helmet', detected: true, confidence: 0.88, status: 'CONFIRMED' },
          { id: '2', item: 'safetyVest', label: 'Vest', detected: true, confidence: 0.85, status: 'CONFIRMED' },
          { id: '3', item: 'gloves', label: 'Gloves', detected: true, confidence: 0.80, status: 'CONFIRMED' },
          { id: '4', item: 'eyeProtection', label: 'Glasses', detected: true, confidence: 0.79, status: 'CONFIRMED' }
        ]
      };

      const validation = PPETrainingValidator.validate(mockResult);
      expect(validation.status).toBe('COMPLIANT');
      expect(validation.canAdvance).toBe(true);
      expect(validation.missingItems.length).toBe(0);
    });

    it('7. Low-confidence item (<0.70 & >=0.45) must trigger UNCERTAIN validation', () => {
      const mockResult: PPEDetectionResult = {
        id: 'ppe_test_2',
        timestamp: new Date().toISOString(),
        overallConfidence: 0.60,
        isDevSimulation: true,
        inferenceTimeMs: 10,
        items: [
          { id: '1', item: 'helmet', label: 'Helmet', detected: true, confidence: 0.90, status: 'CONFIRMED' },
          { id: '2', item: 'safetyVest', label: 'Vest', detected: true, confidence: 0.52, status: 'UNCERTAIN' }, // Uncertain
          { id: '3', item: 'gloves', label: 'Gloves', detected: true, confidence: 0.80, status: 'CONFIRMED' },
          { id: '4', item: 'eyeProtection', label: 'Glasses', detected: true, confidence: 0.80, status: 'CONFIRMED' }
        ]
      };

      const validation = PPETrainingValidator.validate(mockResult);
      expect(validation.status).toBe('UNCERTAIN');
      expect(validation.canAdvance).toBe(false);
      expect(validation.uncertainItems).toContain('safetyVest');
    });

    it('8. Missing mandatory item must trigger NON_COMPLIANT validation', () => {
      const mockResult: PPEDetectionResult = {
        id: 'ppe_test_3',
        timestamp: new Date().toISOString(),
        overallConfidence: 0.65,
        isDevSimulation: true,
        inferenceTimeMs: 11,
        items: [
          { id: '1', item: 'helmet', label: 'Helmet', detected: true, confidence: 0.90, status: 'CONFIRMED' },
          { id: '2', item: 'safetyVest', label: 'Vest', detected: false, confidence: 0.20, status: 'MISSING' }, // Missing
          { id: '3', item: 'gloves', label: 'Gloves', detected: true, confidence: 0.80, status: 'CONFIRMED' },
          { id: '4', item: 'eyeProtection', label: 'Glasses', detected: true, confidence: 0.80, status: 'CONFIRMED' }
        ]
      };

      const validation = PPETrainingValidator.validate(mockResult);
      expect(validation.status).toBe('NON_COMPLIANT');
      expect(validation.canAdvance).toBe(false);
      expect(validation.missingItems).toContain('safetyVest');
    });
  });

  describe('3. Training Engine & Scoring Integration', () => {
    it('9. Compliant PPE verification advances Step 1 with 0 penalty', () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO);
      engine.start();

      const step1 = engine.getCurrentStep()!;
      expect(step1.id).toBe('step_01_ppe');

      // Trainee executes verified PPE action
      const ppeAction = step1.allowedActions.find(a => a.id === 'act_equip_ppe')!;
      const validation = engine.executeAction(ppeAction);

      expect(validation.status).toBe('CORRECT');
      expect(validation.penaltyDeducted).toBe(0);
      expect(engine.getScoreState().currentScore).toBe(100);
    });

    it('10. Retrying an uncertain PPE scan incurs NO score penalty', () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO);
      engine.start();

      // Trainee encounters uncertain scan, retries scan
      engine.retry();
      expect(engine.getScoreState().currentScore).toBe(100);
      expect(engine.getScoreState().totalPenalties).toBe(0);
    });

    it('11. PPE Labels standard references must be valid', () => {
      expect(PPE_LABELS.helmet.standard).toContain('EN 397');
      expect(PPE_LABELS.safetyVest.standard).toContain('ISO 20471');
      expect(PPE_LABELS.gloves.standard).toContain('EN 388');
    });
  });
});

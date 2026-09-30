import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MINING_SAFETY_SCENARIO, getScenarioById } from '../data/scenariosData';
import { CameraARManager } from '../training/camera/CameraARManager';

describe('Phase 2 3D Training Environment & Camera AR Tests', () => {
  let cameraManager: CameraARManager;

  beforeEach(() => {
    cameraManager = new CameraARManager();
  });

  afterEach(() => {
    cameraManager.dispose();
  });

  describe('1. Mining Safety Scenario Data Validity', () => {
    it('should have valid ID, bounds, and camera vectors', () => {
      expect(MINING_SAFETY_SCENARIO.id).toBe('mining-basic-scene');
      expect(MINING_SAFETY_SCENARIO.courseId).toBe('mining-safety-01');
      expect(MINING_SAFETY_SCENARIO.environmentType).toBe('MINING_EXCAVATION');
      expect(MINING_SAFETY_SCENARIO.environmentBounds.width).toBe(24);
      expect(MINING_SAFETY_SCENARIO.cameraInitialPosition).toBeDefined();
      expect(MINING_SAFETY_SCENARIO.cameraTargetPosition).toBeDefined();
    });

    it('should retrieve scenario by ID correctly', () => {
      const found = getScenarioById('mining-basic-scene');
      expect(found).toBeDefined();
      expect(found?.title).toContain('Mining Safety');
    });

    it('should return undefined for invalid scenario ID', () => {
      const found = getScenarioById('invalid-scenario-id');
      expect(found).toBeUndefined();
    });
  });

  describe('2. Hazard Definitions & Compliance', () => {
    it('should define critical 415V electrical hazard with >= 2.5m safe distance', () => {
      const elec = MINING_SAFETY_SCENARIO.hazards.find(h => h.id === 'hazard_elec_01');
      expect(elec).toBeDefined();
      expect(elec?.type).toBe('ELECTRICAL');
      expect(elec?.severity).toBe('CRITICAL');
      expect(elec?.safeDistanceRadius).toBeGreaterThanOrEqual(2.5);
      expect(elec?.requiredPrecaution).toContain('Lockout/Tagout');
    });

    it('should define moving machinery hazard with safe distance', () => {
      const mach = MINING_SAFETY_SCENARIO.hazards.find(h => h.id === 'hazard_machinery_02');
      expect(mach).toBeDefined();
      expect(mach?.type).toBe('MOVING_MACHINERY');
      expect(mach?.severity).toBe('HIGH');
      expect(mach?.safeDistanceRadius).toBeGreaterThanOrEqual(2.0);
    });

    it('should define restricted overhead rockfall zone', () => {
      const zone = MINING_SAFETY_SCENARIO.hazards.find(h => h.id === 'hazard_restricted_03');
      expect(zone).toBeDefined();
      expect(zone?.type).toBe('RESTRICTED_ZONE');
    });

    it('all hazards must have position coordinates, warning texts, and visual cues', () => {
      MINING_SAFETY_SCENARIO.hazards.forEach(h => {
        expect(h.position.x).toBeTypeOf('number');
        expect(h.position.y).toBeTypeOf('number');
        expect(h.position.z).toBeTypeOf('number');
        expect(h.warningText.length).toBeGreaterThan(5);
        expect(h.visualCue.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe('3. Interactive Equipment & Objects', () => {
    it('should include PPE station, Electrical panel, Machine, E-Stop, Safe Zone, Assembly Point', () => {
      const types = MINING_SAFETY_SCENARIO.objects.map(o => o.type);
      expect(types).toContain('PPE_STATION');
      expect(types).toContain('ELECTRICAL_PANEL');
      expect(types).toContain('MACHINE');
      expect(types).toContain('EMERGENCY_STOP');
      expect(types).toContain('SAFE_ZONE');
      expect(types).toContain('ASSEMBLY_POINT');
    });

    it('all objects must have action hints and interactable status', () => {
      MINING_SAFETY_SCENARIO.objects.forEach(obj => {
        expect(obj.interactable).toBe(true);
        expect(obj.actionHint.length).toBeGreaterThan(5);
      });
    });
  });

  describe('4. Camera AR Manager & Permission Fallbacks', () => {
    it('should start in IDLE status', () => {
      expect(cameraManager.getStatus()).toBe('IDLE');
      expect(cameraManager.getErrorMessage()).toBeNull();
    });

    it('should handle unavailable camera environment gracefully', async () => {
      // In node/test environment without navigator.mediaDevices
      const stream = await cameraManager.startCamera();
      expect(stream).toBeNull();
      expect(['UNAVAILABLE', 'ERROR', 'DENIED']).toContain(cameraManager.getStatus());
      expect(cameraManager.getErrorMessage()).not.toBeNull();
    });

    it('should stop camera and reset status to IDLE', () => {
      cameraManager.stopCamera();
      expect(cameraManager.getStatus()).toBe('IDLE');
    });

    it('should notify status listeners on change', async () => {
      const statusLog: string[] = [];
      const unsub = cameraManager.onStatusChange((status) => {
        statusLog.push(status);
      });

      await cameraManager.startCamera();
      cameraManager.stopCamera();
      unsub();

      expect(statusLog.length).toBeGreaterThanOrEqual(2);
      expect(statusLog[0]).toBe('IDLE');
    });

    it('should handle simulated permission denied error', async () => {
      const mockGetUserMedia = vi.fn().mockRejectedValue({ name: 'NotAllowedError', message: 'Permission denied' });
      const origMediaDevices = global.navigator?.mediaDevices;

      Object.defineProperty(global.navigator, 'mediaDevices', {
        value: { getUserMedia: mockGetUserMedia },
        configurable: true
      });

      const mgr = new CameraARManager();
      const stream = await mgr.startCamera();
      expect(stream).toBeNull();
      expect(mgr.getStatus()).toBe('DENIED');
      expect(mgr.getErrorMessage()).toContain('permission was denied');

      mgr.dispose();

      // Restore
      if (origMediaDevices) {
        Object.defineProperty(global.navigator, 'mediaDevices', { value: origMediaDevices, configurable: true });
      }
    });
  });
});

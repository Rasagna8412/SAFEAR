import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsRepository } from '../services/analytics/analyticsRepository';

describe('Phase 8 Dashboard Architecture & Analytics Tests', () => {
  let analytics: AnalyticsRepository;

  beforeEach(() => {
    analytics = new AnalyticsRepository();
  });

  describe('1. Worker Progress Analytics', () => {
    it('1. Worker progress summary calculates baseline metrics correctly', async () => {
      const summary = await analytics.getWorkerProgress('usr_worker_01', 'Ravi Kumar');
      expect(summary.userId).toBe('usr_worker_01');
      expect(summary.userName).toBe('Ravi Kumar');
      expect(summary.role).toBe('Worker');
      expect(summary.averageScore).toBeGreaterThanOrEqual(0);
      expect(summary.ppeComplianceRate).toBeGreaterThanOrEqual(0);
    });

    it('2. Worker private data isolation: only requested worker progress is returned', async () => {
      const summaryA = await analytics.getWorkerProgress('usr_worker_01', 'Ravi Kumar');
      const summaryB = await analytics.getWorkerProgress('usr_worker_02', 'Sarah Jenkins');

      expect(summaryA.userId).toBe('usr_worker_01');
      expect(summaryB.userId).toBe('usr_worker_02');
      expect(summaryA.userName).not.toBe(summaryB.userName);
    });
  });

  describe('2. Trainer Oversight & Cohort Analytics', () => {
    it('3. Trainer dashboard aggregates assigned cohort statistics accurately', async () => {
      const data = await analytics.getTrainerDashboardData('usr_trainer_01');
      expect(data.assignedWorkersCount).toBe(3);
      expect(data.workers.length).toBe(3);
      expect(data.averagePassingRate).toBeGreaterThanOrEqual(70);
      expect(data.averageCohortScore).toBeGreaterThanOrEqual(70);
      expect(data.scoreDistribution.length).toBe(4);
    });
  });

  describe('3. Admin Enterprise Intelligence', () => {
    it('4. Admin system analytics reports global platform telemetry', async () => {
      const data = await analytics.getAdminSystemAnalytics();
      expect(data.totalRegisteredUsers).toBe(24);
      expect(data.workerCount).toBe(18);
      expect(data.trainerCount).toBe(4);
      expect(data.adminCount).toBe(2);
      expect(data.blockchainVerificationRate).toBe(100);
      expect(data.systemHealth).toBe('OPERATIONAL');
    });
  });
});

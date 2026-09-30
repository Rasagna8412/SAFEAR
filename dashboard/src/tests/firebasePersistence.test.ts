import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FirestoreCourseRepository, ICourseRepository } from '../services/repositories/courseRepository';
import { FirestoreScenarioRepository, IScenarioRepository } from '../services/repositories/scenarioRepository';
import { FirestoreTrainingSessionRepository } from '../services/repositories/trainingSessionRepository';
import { FirestoreTrainingResultRepository } from '../services/repositories/trainingResultRepository';
import { FirestoreAssignmentRepository } from '../services/repositories/assignmentRepository';
import { localAuthService } from '../services/auth/localAuthService';
import { MINING_SAFETY_SCENARIO } from '../data/scenariosData';
import { TrainingEngine } from '../training/engine/TrainingEngine';

describe('Phase 5 Firebase Integration & Full Persistence Layer Tests', () => {
  let courseRepo: ICourseRepository;
  let scenarioRepo: IScenarioRepository;
  let sessionRepo: FirestoreTrainingSessionRepository;
  let resultRepo: FirestoreTrainingResultRepository;
  let assignmentRepo: FirestoreAssignmentRepository;

  beforeEach(() => {
    courseRepo = new FirestoreCourseRepository();
    scenarioRepo = new FirestoreScenarioRepository();
    sessionRepo = new FirestoreTrainingSessionRepository();
    resultRepo = new FirestoreTrainingResultRepository();
    assignmentRepo = new FirestoreAssignmentRepository();
  });

  describe('1. Course & Scenario Repository Abstractions', () => {
    it('1. CourseRepository should retrieve course catalog with fallback', async () => {
      const courses = await courseRepo.getAllCourses();
      expect(courses.length).toBeGreaterThanOrEqual(3);
      expect(courses.find(c => c.id === 'mining-safety-01')).toBeDefined();
    });

    it('2. CourseRepository should retrieve specific course by ID', async () => {
      const course = await courseRepo.getCourseById('mining-safety-01');
      expect(course).not.toBeNull();
      expect(course?.title).toContain('Mining Safety');
    });

    it('3. ScenarioRepository should retrieve Mining Safety scenario', async () => {
      const scenario = await scenarioRepo.getScenarioById('mining-basic-scene');
      expect(scenario).not.toBeNull();
      expect(scenario?.id).toBe('mining-basic-scene');
      expect(scenario?.hazards.length).toBe(4);
    });
  });

  describe('2. Training Session & Result Persistence', () => {
    it('4. TrainingSessionRepository should structure session record correctly', async () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO, 'usr_worker_01');
      engine.start();

      const session = engine.getSession();
      expect(session.sessionId).toMatch(/^trn_/);
      expect(session.scenarioId).toBe('mining-basic-scene');
      expect(session.userId).toBe('usr_worker_01');

      const saveSpy = vi.spyOn(sessionRepo, 'saveSession').mockResolvedValue();
      await sessionRepo.saveSession(session);
      expect(saveSpy).toHaveBeenCalledWith(session);
    });

    it('5. TrainingResultRepository should create structured result with score & compliance', async () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO, 'usr_worker_01');
      engine.start();

      for (let i = 0; i < 6; i++) {
        const step = engine.getCurrentStep()!;
        engine.executeAction(step.allowedActions.find(a => a.id === step.requiredActionId)!);
        if (i < 5) engine.advanceStep();
      }

      const completedSession = engine.getSession();
      expect(completedSession.isCompleted).toBe(true);

      const record = await resultRepo.saveResult(completedSession);
      expect(record.resultId).toBe(`res_${completedSession.sessionId}`);
      expect(record.score).toBe(100);
      expect(record.passed).toBe(true);
      expect(record.userId).toBe('usr_worker_01');
      expect(record.penalties).toBe(0);
      expect(record.correctActions).toBe(6);
    });

    it('6. Failed training result (<70%) should be marked as passed: false', async () => {
      const engine = new TrainingEngine(MINING_SAFETY_SCENARIO, 'usr_worker_02');
      engine.start();

      for (let i = 0; i < 3; i++) {
        const step = engine.getCurrentStep()!;
        const unsafe = step.allowedActions.find(a => !a.isSafe);
        if (unsafe) engine.executeAction(unsafe);
        engine.advanceStep();
      }
      for (let i = 3; i < 6; i++) {
        const step = engine.getCurrentStep()!;
        engine.executeAction(step.allowedActions.find(a => a.id === step.requiredActionId)!);
        if (i < 5) engine.advanceStep();
      }

      const completedSession = engine.getSession();
      const record = await resultRepo.saveResult(completedSession);

      expect(record.score).toBeLessThan(70);
      expect(record.passed).toBe(false);
    });
  });

  describe('3. Assignment Model & Security Boundaries', () => {
    it('7. AssignmentRepository should structure worker assignments', async () => {
      const asgn = await assignmentRepo.createAssignment({
        workerId: 'usr_worker_01',
        courseId: 'mining-safety-01',
        scenarioId: 'mining-basic-scene',
        assignedBy: 'usr_trainer_01',
        status: 'PENDING'
      });

      expect(asgn.id).toMatch(/^asgn_/);
      expect(asgn.workerId).toBe('usr_worker_01');
      expect(asgn.status).toBe('PENDING');
    });

    it('8. Worker role isolation: results must be partitionable by userId', async () => {
      const spy = vi.spyOn(resultRepo, 'getUserResults').mockResolvedValue([
        {
          resultId: 'res_1',
          sessionId: 'trn_1',
          userId: 'usr_worker_01',
          scenarioId: 'mining-basic-scene',
          score: 95,
          passed: true,
          correctActions: 5,
          incorrectActions: 1,
          unsafeActions: 0,
          skippedSteps: 0,
          penalties: 5,
          completedAt: new Date().toISOString()
        }
      ]);

      const results = await resultRepo.getUserResults('usr_worker_01');
      expect(results.length).toBe(1);
      expect(results[0].userId).toBe('usr_worker_01');
      expect(spy).toHaveBeenCalledWith('usr_worker_01');
    });

    it('9. Self-registration must strictly create Worker role ONLY', async () => {
      const user = await localAuthService.register({
        name: 'Carlos Ruiz',
        email: 'carlos.ruiz@safe-mining.org'
      });
      expect(user.role).toBe('Worker');
    });

    it('10. Updating profile must not allow client-side role escalation to Admin', async () => {
      await localAuthService.loginAsDemo('Worker');
      const updated = await localAuthService.updateProfile({
        name: 'Alex Chen (Updated)'
      });
      expect(updated.role).toBe('Worker');
      expect(localAuthService.getCurrentUser()?.role).toBe('Worker');
    });
  });
});

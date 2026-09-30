import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { TrainingSession } from '../../types/trainingEngine';
import { db } from '../firebase/firebaseConfig';

export interface ITrainingSessionRepository {
  saveSession(session: TrainingSession): Promise<void>;
  getSession(sessionId: string): Promise<TrainingSession | null>;
  getUserSessions(userId: string): Promise<TrainingSession[]>;
}

const localSessionsCache = new Map<string, TrainingSession>();

export class FirestoreTrainingSessionRepository implements ITrainingSessionRepository {
  public async saveSession(session: TrainingSession): Promise<void> {
    localSessionsCache.set(session.sessionId, session);

    try {
      const sessionRef = doc(db, 'trainingSessions', session.sessionId);
      const writePromise = setDoc(sessionRef, {
        sessionId: session.sessionId,
        scenarioId: session.scenarioId,
        userId: session.userId || 'anonymous',
        currentState: session.currentState,
        currentStepIndex: session.currentStepIndex,
        totalSteps: session.totalSteps,
        startedAt: session.startedAt,
        completedAt: session.completedAt || null,
        selectedActions: session.selectedActions,
        identifiedHazards: session.identifiedHazards,
        stepResults: session.stepResults,
        scoreState: session.scoreState,
        isCompleted: session.isCompleted,
        updatedAt: serverTimestamp()
      }, { merge: true });

      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timeout')), 1000)
      );

      await Promise.race([writePromise, timeoutPromise]);
    } catch {
      // Local fallback cached
    }
  }

  public async getSession(sessionId: string): Promise<TrainingSession | null> {
    try {
      const snap = await getDoc(doc(db, 'trainingSessions', sessionId));
      if (snap.exists()) {
        return snap.data() as TrainingSession;
      }
    } catch {
      // Fallback
    }
    return localSessionsCache.get(sessionId) || null;
  }

  public async getUserSessions(userId: string): Promise<TrainingSession[]> {
    try {
      const q = query(collection(db, 'trainingSessions'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => d.data() as TrainingSession);
      }
    } catch {
      // Fallback
    }
    return Array.from(localSessionsCache.values()).filter(s => s.userId === userId);
  }
}

export const trainingSessionRepository: ITrainingSessionRepository = new FirestoreTrainingSessionRepository();

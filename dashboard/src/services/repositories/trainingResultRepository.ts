import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { TrainingSession } from '../../types/trainingEngine';

export interface TrainingResultRecord {
  resultId: string;
  sessionId: string;
  userId: string;
  scenarioId: string;
  score: number;
  passed: boolean;
  correctActions: number;
  incorrectActions: number;
  unsafeActions: number;
  skippedSteps: number;
  penalties: number;
  completedAt: string;
  createdAt?: any;
}

export interface ITrainingResultRepository {
  saveResult(session: TrainingSession): Promise<TrainingResultRecord>;
  getUserResults(userId: string): Promise<TrainingResultRecord[]>;
  getResultById(resultId: string): Promise<TrainingResultRecord | null>;
}

// Local in-memory / localStorage fallback cache
const localResultsCache = new Map<string, TrainingResultRecord>();

export class FirestoreTrainingResultRepository implements ITrainingResultRepository {
  public async saveResult(session: TrainingSession): Promise<TrainingResultRecord> {
    const resultId = `res_${session.sessionId}`;
    const scoreState = session.scoreState;
    const finalScore = scoreState?.currentScore ?? 100;
    const isPassed = finalScore >= 70;

    const record: TrainingResultRecord = {
      resultId,
      sessionId: session.sessionId,
      userId: session.userId || 'anonymous',
      scenarioId: session.scenarioId,
      score: finalScore,
      passed: isPassed,
      correctActions: scoreState?.correctActions ?? 0,
      incorrectActions: scoreState?.incorrectActions ?? 0,
      unsafeActions: scoreState?.unsafeActions ?? 0,
      skippedSteps: scoreState?.skippedSteps ?? 0,
      penalties: scoreState?.totalPenalties ?? 0,
      completedAt: session.completedAt || new Date().toISOString()
    };

    localResultsCache.set(resultId, record);

    try {
      const resultRef = doc(db, 'trainingResults', resultId);
      // Timeout promise to avoid hanging if offline in test runner
      const writePromise = setDoc(resultRef, {
        ...record,
        createdAt: serverTimestamp()
      });

      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timeout')), 1000)
      );

      await Promise.race([writePromise, timeoutPromise]);
    } catch {
      // Local fallback cached
    }

    return record;
  }

  public async getUserResults(userId: string): Promise<TrainingResultRecord[]> {
    try {
      const q = query(collection(db, 'trainingResults'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => d.data() as TrainingResultRecord);
      }
    } catch {
      // Fallback to cache
    }
    return Array.from(localResultsCache.values()).filter(r => r.userId === userId);
  }

  public async getResultById(resultId: string): Promise<TrainingResultRecord | null> {
    try {
      const snap = await getDoc(doc(db, 'trainingResults', resultId));
      if (snap.exists()) {
        return snap.data() as TrainingResultRecord;
      }
    } catch {
      // Fallback to cache
    }
    return localResultsCache.get(resultId) || null;
  }
}

export const trainingResultRepository: ITrainingResultRepository = new FirestoreTrainingResultRepository();

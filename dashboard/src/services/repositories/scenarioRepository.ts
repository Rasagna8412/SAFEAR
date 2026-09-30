import { doc, getDoc } from 'firebase/firestore';
import { TrainingScenario } from '../../types/training';
import { ALL_SCENARIOS, MINING_SAFETY_SCENARIO } from '../../data/scenariosData';
import { db } from '../firebase/firebaseConfig';

export interface IScenarioRepository {
  getScenarioById(scenarioId: string): Promise<TrainingScenario | null>;
}

export class FirestoreScenarioRepository implements IScenarioRepository {
  public async getScenarioById(scenarioId: string): Promise<TrainingScenario | null> {
    try {
      const snap = await getDoc(doc(db, 'scenarios', scenarioId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as TrainingScenario;
      }
    } catch {
      // Local fallback
    }
    const found = ALL_SCENARIOS[scenarioId] || MINING_SAFETY_SCENARIO;
    return found || null;
  }
}

export const scenarioRepository: IScenarioRepository = new FirestoreScenarioRepository();

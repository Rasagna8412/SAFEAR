import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export interface AssignmentRecord {
  id: string;
  workerId: string;
  courseId: string;
  scenarioId: string;
  assignedBy: string;
  assignedAt: string;
  dueDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface IAssignmentRepository {
  getWorkerAssignments(workerId: string): Promise<AssignmentRecord[]>;
  createAssignment(assignment: Omit<AssignmentRecord, 'id' | 'assignedAt'>): Promise<AssignmentRecord>;
}

const localAssignmentsCache = new Map<string, AssignmentRecord>();

export class FirestoreAssignmentRepository implements IAssignmentRepository {
  public async getWorkerAssignments(workerId: string): Promise<AssignmentRecord[]> {
    try {
      const q = query(collection(db, 'assignments'), where('workerId', '==', workerId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as AssignmentRecord));
      }
    } catch {
      // Fallback
    }
    return Array.from(localAssignmentsCache.values()).filter(a => a.workerId === workerId);
  }

  public async createAssignment(
    assignment: Omit<AssignmentRecord, 'id' | 'assignedAt'>
  ): Promise<AssignmentRecord> {
    const id = `asgn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const fullAssignment: AssignmentRecord = {
      ...assignment,
      id,
      assignedAt: new Date().toISOString()
    };

    localAssignmentsCache.set(id, fullAssignment);

    try {
      const docRef = doc(db, 'assignments', id);
      const writePromise = setDoc(docRef, {
        ...fullAssignment,
        createdAt: serverTimestamp()
      });

      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timeout')), 1000)
      );

      await Promise.race([writePromise, timeoutPromise]);
    } catch {
      // Local fallback
    }

    return fullAssignment;
  }
}

export const assignmentRepository: IAssignmentRepository = new FirestoreAssignmentRepository();

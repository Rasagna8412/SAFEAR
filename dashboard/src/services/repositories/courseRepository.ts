import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Course } from '../../types/course';
import { INITIAL_COURSES } from '../../data/coursesData';
import { db } from '../firebase/firebaseConfig';

export interface ICourseRepository {
  getAllCourses(): Promise<Course[]>;
  getCourseById(courseId: string): Promise<Course | null>;
}

export class FirestoreCourseRepository implements ICourseRepository {
  public async getAllCourses(): Promise<Course[]> {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
      }
    } catch {
      // Local fallback
    }
    return INITIAL_COURSES;
  }

  public async getCourseById(courseId: string): Promise<Course | null> {
    try {
      const snap = await getDoc(doc(db, 'courses', courseId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Course;
      }
    } catch {
      // Local fallback
    }
    const found = INITIAL_COURSES.find(c => c.id === courseId);
    return found || null;
  }
}

export const courseRepository: ICourseRepository = new FirestoreCourseRepository();

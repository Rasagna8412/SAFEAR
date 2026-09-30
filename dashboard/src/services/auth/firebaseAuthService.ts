import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, LoginCredentials, RegisterData, UserRole } from '../../types/auth';
import { IAuthService } from './authService';
import { auth, db } from '../firebase/firebaseConfig';
import { DEMO_WORKER, DEMO_TRAINER, DEMO_ADMIN } from './localAuthService';

export class FirebaseAuthService implements IAuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    firebaseOnAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            this.currentUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email || data.email,
              name: data.displayName || data.name || firebaseUser.displayName || 'Worker',
              role: (data.role as UserRole) || 'Worker',
              language: data.language || 'en',
              assignedTrainerId: data.assignedTrainerId,
              createdAt: data.createdAt || new Date().toISOString(),
              avatarUrl: firebaseUser.photoURL || undefined
            };
          } else {
            // Document fallback
            this.currentUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Worker',
              role: 'Worker',
              language: 'en',
              createdAt: new Date().toISOString()
            };
          }
        } catch {
          this.currentUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Worker',
            role: 'Worker',
            language: 'en',
            createdAt: new Date().toISOString()
          };
        }
      } else {
        this.currentUser = null;
      }
      this.notifyListeners();
    });
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  public async login(credentials: LoginCredentials): Promise<User> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password || 'password123';

    if (!email) {
      throw new Error('Email address is required.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch Firestore user doc
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.currentUser = {
          id: uid,
          email: userCredential.user.email || email,
          name: data.displayName || data.name || 'Worker',
          role: (data.role as UserRole) || 'Worker',
          language: data.language || 'en',
          createdAt: data.createdAt || new Date().toISOString()
        };
      } else {
        // Create initial document
        const newUser: User = {
          id: uid,
          email,
          name: email.split('@')[0],
          role: 'Worker',
          language: 'en',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', uid), {
          uid,
          email,
          displayName: newUser.name,
          role: 'Worker',
          language: 'en',
          createdAt: newUser.createdAt
        });
        this.currentUser = newUser;
      }
      this.notifyListeners();
      return this.currentUser;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        // Fallback create user in emulator if not found
        return this.register({
          name: email.split('@')[0],
          email: email,
          password: password
        });
      }
      throw new Error(err.message || 'Firebase login failed.');
    }
  }

  public async register(data: RegisterData): Promise<User> {
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    const password = data.password || 'password123';

    if (!name) throw new Error('Full Name is required.');
    if (!email) throw new Error('Email address is required.');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Strictly enforce Worker role in Firestore document
      const newUser: User = {
        id: uid,
        email,
        name,
        role: 'Worker', // Strictly Worker
        language: data.language || 'en',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        displayName: name,
        role: 'Worker',
        language: newUser.language,
        createdAt: newUser.createdAt
      });

      this.currentUser = newUser;
      this.notifyListeners();
      return newUser;
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        return this.login({ email, password });
      }
      throw new Error(err.message || 'Firebase registration failed.');
    }
  }

  public async loginAsDemo(role: UserRole): Promise<User> {
    let demoUser: User;
    switch (role) {
      case 'Trainer':
        demoUser = DEMO_TRAINER;
        break;
      case 'Admin':
        demoUser = DEMO_ADMIN;
        break;
      case 'Worker':
      default:
        demoUser = DEMO_WORKER;
    }

    try {
      return await this.login({
        email: demoUser.email,
        password: 'password123'
      });
    } catch {
      // Fallback in case emulator auth is not running locally
      this.currentUser = demoUser;
      this.notifyListeners();
      return demoUser;
    }
  }

  public async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    this.currentUser = null;
    this.notifyListeners();
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public async updateProfile(updates: Partial<Pick<User, 'name' | 'language'>>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No authenticated user found.');
    }

    const updatedUser: User = {
      ...this.currentUser,
      ...updates
    };

    try {
      const userRef = doc(db, 'users', this.currentUser.id);
      await updateDoc(userRef, {
        displayName: updatedUser.name,
        language: updatedUser.language
      });
    } catch {
      // Ignore if offline
    }

    this.currentUser = updatedUser;
    this.notifyListeners();
    return updatedUser;
  }

  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

export const firebaseAuthService = new FirebaseAuthService();

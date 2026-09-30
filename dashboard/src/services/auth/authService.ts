import { User, LoginCredentials, RegisterData, UserRole } from '../../types/auth';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<User>;
  register(data: RegisterData): Promise<User>;
  loginAsDemo(role: UserRole): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  updateProfile(updates: Partial<Pick<User, 'name' | 'language'>>): Promise<User>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

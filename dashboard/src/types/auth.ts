export type UserRole = 'Worker' | 'Trainer' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: string;
  assignedTrainerId?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  language?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

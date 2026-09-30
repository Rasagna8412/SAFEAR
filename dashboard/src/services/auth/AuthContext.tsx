import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, UserRole } from '../../types/auth';
import { localAuthService } from './localAuthService';
import { firebaseAuthService } from './firebaseAuthService';
import { IAuthService } from './authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isFirebaseActive: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  loginAsDemo: (role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'language'>>) => Promise<User>;
  clearError: () => void;
  toggleAuthBackend: () => void;
  authService: IAuthService;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default to localAuthService for rapid test development, switchable to firebaseAuthService
  const [useFirebaseAuth, setUseFirebaseAuth] = useState<boolean>(
    import.meta.env.VITE_USE_FIREBASE_AUTH === 'true'
  );

  const activeAuthService: IAuthService = useFirebaseAuth ? firebaseAuthService : localAuthService;

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = activeAuthService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [activeAuthService]);

  const toggleAuthBackend = () => {
    setUseFirebaseAuth(!useFirebaseAuth);
  };

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedUser = await activeAuthService.login(credentials);
      setUser(loggedUser);
      return loggedUser;
    } catch (err: any) {
      const msg = err.message || 'Login failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const registeredUser = await activeAuthService.register(data);
      setUser(registeredUser);
      return registeredUser;
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role: UserRole): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const demoUser = await activeAuthService.loginAsDemo(role);
      setUser(demoUser);
      return demoUser;
    } catch (err: any) {
      const msg = err.message || 'Demo login failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await activeAuthService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'language'>>): Promise<User> => {
    try {
      const updated = await activeAuthService.updateProfile(updates);
      setUser(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        isFirebaseActive: useFirebaseAuth,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        clearError,
        toggleAuthBackend,
        authService: activeAuthService
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

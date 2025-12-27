import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react';
import api, { type User as ApiUser } from '../api/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'artist';
  initial: string;
  avatar_url?: string;
  plan: 'free' | 'premium';
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>; // Добавлено
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapApiUser = (u: ApiUser): User => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || 'user',
    avatar_url: u.avatar_url,
    plan: u.plan || 'free',
    initial: (u.name[0] || 'U').toUpperCase()
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.getMe();
        setUser(mapApiUser(me));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: apiUser } = await api.login(email, password);
    setUser(mapApiUser(apiUser));
  };

  // Алиас для старого кода
  const loginWithCredentials = login;

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    const { user: apiUser } = await api.register(
      name,
      email,
      password,
      password_confirmation
    );
    setUser(mapApiUser(apiUser));
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isLoggedIn = !!user;

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        loginWithCredentials, // Добавлено
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

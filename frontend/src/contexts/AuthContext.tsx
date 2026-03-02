import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
  'politician': {
    id: 'p1', name: 'Shri Rajesh Kumar', email: 'rajesh@example.com',
    phone: '9876543200', role: 'politician',
  },
  'worker': {
    id: 'w1', name: 'Amit Sharma', email: 'amit@example.com',
    phone: '9876543210', role: 'worker', ward: 'Ward 1 - Central',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string, role: UserRole): Promise<boolean> => {
    // Mock login — accept any credentials
    await new Promise(r => setTimeout(r, 800));
    const mockUser = MOCK_USERS[role];
    if (mockUser) {
      const u = { ...mockUser, email };
      setUser(u);
      localStorage.setItem('auth_user', JSON.stringify(u));
      localStorage.setItem('auth_token', 'mock-jwt-token-' + role);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

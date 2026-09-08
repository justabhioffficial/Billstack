import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authApi, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state or restore session
    const restoreSession = async () => {
      try {
        const res = await authApi.getCurrentUser();
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (ignored) {}
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (res.data.success) {
      setAuthToken(res.data.data.accessToken);
      setUser(res.data.data.user);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    if (res.data.success) {
      setAuthToken(res.data.data.accessToken);
      setUser(res.data.data.user);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

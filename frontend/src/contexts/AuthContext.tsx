import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('billstack_token');
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.data.success) {
            setUser(res.data.data);
          }
        } catch (e) {
          localStorage.removeItem('billstack_token');
          localStorage.removeItem('billstack_refresh_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (data: any) => {
    const res = await authApi.login(data);
    if (res.data.success) {
      const authData: AuthResponse = res.data.data;
      localStorage.setItem('billstack_token', authData.accessToken);
      localStorage.setItem('billstack_refresh_token', authData.refreshToken);
      setUser(authData.user);
    }
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    if (res.data.success) {
      const authData: AuthResponse = res.data.data;
      localStorage.setItem('billstack_token', authData.accessToken);
      localStorage.setItem('billstack_refresh_token', authData.refreshToken);
      setUser(authData.user);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (ignored) {}
    localStorage.removeItem('billstack_token');
    localStorage.removeItem('billstack_refresh_token');
    setUser(null);
  };

  const updateUser = async (data: any) => {
    const res = await authApi.updateUser(data);
    if (res.data.success) {
      setUser(res.data.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

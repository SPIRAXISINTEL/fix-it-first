import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  email: string;
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, email: '' });

  const login = useCallback((email: string, password: string) => {
    if (email === 'admin@admin.ma' && password === 'admin') {
      setAuth({ isAuthenticated: true, email });
      return { success: true, message: '' };
    }
    return { success: false, message: 'Email ou mot de passe incorrect' };
  }, []);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, email: '' });
  }, []);

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

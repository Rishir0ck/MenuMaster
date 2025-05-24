
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (userName?: string, callback?: () => void) => void;
  logout: (callback?: () => void) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'isMockAuthenticated';
const USER_NAME_KEY = 'mockUserName';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      const storedUserName = localStorage.getItem(USER_NAME_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
        if (storedUserName) {
          setUserName(storedUserName);
        }
      }
    } catch (e) {
      console.error("Failed to access localStorage for auth state:", e);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((name?: string, callback?: () => void) => {
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      if (name) {
        localStorage.setItem(USER_NAME_KEY, name);
        setUserName(name);
      } else {
        localStorage.removeItem(USER_NAME_KEY); // Clear name if not provided
        setUserName(null);
      }
    } catch (e) {
       console.error("Failed to set localStorage for auth state:", e);
    }
    setIsAuthenticated(true);
    if (callback) {
      callback();
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const logout = useCallback((callback?: () => void) => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_NAME_KEY);
    } catch (e) {
      console.error("Failed to remove localStorage for auth state:", e);
    }
    setIsAuthenticated(false);
    setUserName(null);
    if (callback) {
      callback();
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout, isLoading }}>
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

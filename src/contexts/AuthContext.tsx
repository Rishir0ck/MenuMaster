
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (callback?: () => void) => void;
  logout: (callback?: () => void) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'isMockAuthenticated';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to access localStorage for auth state:", e);
      // Keep isAuthenticated as false
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((callback?: () => void) => {
    try {
      localStorage.setItem(AUTH_KEY, 'true');
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
    } catch (e) {
      console.error("Failed to remove localStorage for auth state:", e);
    }
    setIsAuthenticated(false);
    if (callback) {
      callback();
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
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

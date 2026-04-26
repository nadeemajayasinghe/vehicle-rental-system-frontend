'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerService, CustomerResponse } from '@/services/customerService';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: CustomerResponse | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: CustomerResponse) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload {
  sub: string;
  customerId: number;
  role: string;
  exp: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      loadUserFromToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserFromToken = async (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const customerId = decoded.customerId;

      console.log('Auth debug - decoded token payload:', decoded);
      
      if (!customerId) {
        throw new Error('Customer ID not found in token');
      }
      
      const userData = await customerService.getProfile(customerId);
      console.log('Auth debug - customer details:', userData);
      setUser(userData);
      setToken(token);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    await loadUserFromToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser: CustomerResponse) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
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

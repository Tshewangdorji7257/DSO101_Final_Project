"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { api, getAuthToken, setAuthToken, removeAuthToken } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name: string; avatar?: string; bio?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await api.getProfile();
          setUser({
            id: String(userData.id),
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            bio: userData.bio,
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          removeAuthToken();
          setUser(null);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      setAuthToken(response.token);
      setUser({
        id: String(response.user.id),
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.register(name, email, password);
      setAuthToken(response.token);
      setUser({
        id: String(response.user.id),
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateProfile = async (data: { name: string; avatar?: string; bio?: string }) => {
    setIsLoading(true);
    try {
      const response = await api.updateProfile(data);
      setUser({
        id: String(response.id),
        name: response.name,
        email: response.email,
        avatar: response.avatar,
        bio: response.bio,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

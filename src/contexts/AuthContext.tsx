import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User, Patient, Nurse, LoginRequest, RegisterRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  patientData: Patient | null;
  nurseData: Nurse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [nurseData, setNurseData] = useState<Nurse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
      setPatientData(profile.patient_data || null);
      setNurseData(profile.nurse_data || null);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // If profile fetch fails, user might be logged out
      setUser(null);
      setPatientData(null);
      setNurseData(null);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      const response = await api.login(data);
      setUser(response.user);
      
      // Fetch additional profile data
      await refreshProfile();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await api.register(data);
      setUser(response.user);
      
      // Fetch additional profile data
      await refreshProfile();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setPatientData(null);
    setNurseData(null);
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (api.getToken()) {
          await refreshProfile();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid token
        api.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    patientData,
    nurseData,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

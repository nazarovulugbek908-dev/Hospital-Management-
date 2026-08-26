// Auth Context providing role checking, authentication state, and logged-in doctor session

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser } from '../services/backendStore.js';
import { api } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnDuty, setIsOnDuty] = useState(true);

  // Initialize auth state
  useEffect(() => {
    async function loadAuth() {
      try {
        const storedUser = getCurrentUser();
        if (storedUser && storedUser.role === 'doctor') {
          setUser(storedUser);
          const profile = await api.getCurrentDoctorProfile(storedUser.doctorId);
          setDoctorProfile(profile);
        } else if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Failed to load authenticated user:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await api.login(email, password);
      setUser(loggedUser);
      if (loggedUser.role === 'doctor') {
        const profile = await api.getCurrentDoctorProfile(loggedUser.doctorId);
        setDoctorProfile(profile);
      }
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    setDoctorProfile(null);
  };

  const refreshProfile = async () => {
    if (user && user.doctorId) {
      const profile = await api.getCurrentDoctorProfile(user.doctorId);
      setDoctorProfile(profile);
    }
  };

  const toggleDutyStatus = () => {
    setIsOnDuty(prev => !prev);
  };

  const isDoctor = user?.role === 'doctor';

  return (
    <AuthContext.Provider
      value={{
        user,
        doctorProfile,
        isDoctor,
        loading,
        isOnDuty,
        toggleDutyStatus,
        login,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

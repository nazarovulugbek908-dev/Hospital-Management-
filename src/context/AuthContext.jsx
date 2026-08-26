// Auth Context supporting both Doctor and Patient roles

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser } from '../services/backendStore.js';
import { api } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnDuty, setIsOnDuty] = useState(true);

  // Load active user session
  useEffect(() => {
    async function loadAuth() {
      try {
        const storedUser = getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
          if (storedUser.role === 'doctor') {
            const profile = await api.getCurrentDoctorProfile(storedUser.doctorId);
            setDoctorProfile(profile);
          } else if (storedUser.role === 'patient') {
            const profile = await api.getPatientProfile(storedUser.patientId);
            setPatientProfile(profile);
          }
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
        setPatientProfile(null);
      } else if (loggedUser.role === 'patient') {
        const profile = await api.getPatientProfile(loggedUser.patientId);
        setPatientProfile(profile);
        setDoctorProfile(null);
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
    setPatientProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.role === 'doctor' && user.doctorId) {
      const profile = await api.getCurrentDoctorProfile(user.doctorId);
      setDoctorProfile(profile);
    } else if (user?.role === 'patient' && user.patientId) {
      const profile = await api.getPatientProfile(user.patientId);
      setPatientProfile(profile);
    }
  };

  const toggleDutyStatus = () => {
    setIsOnDuty(prev => !prev);
  };

  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  return (
    <AuthContext.Provider
      value={{
        user,
        doctorProfile,
        patientProfile,
        isDoctor,
        isPatient,
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

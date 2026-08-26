import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { initialDemoPatient } from '../data/mockData.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [patient, setPatient] = useState(() => {
    try {
      const saved = localStorage.getItem('medicare_patient_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse patient user from localStorage:', e);
    }
    return initialDemoPatient;
  });

  const [loading, setLoading] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (patient) {
      localStorage.setItem('medicare_patient_user', JSON.stringify(patient));
    } else {
      localStorage.removeItem('medicare_patient_user');
    }
  }, [patient]);

  // Listen to Supabase auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        const mappedPatient = {
          id: u.id,
          name: meta.full_name || meta.name || u.email.split('@')[0],
          email: u.email,
          phone: meta.phone || '+1 (555) 000-0000',
          dateOfBirth: meta.date_of_birth || '1995-01-01',
          gender: meta.gender || 'Not specified',
          bloodGroup: meta.blood_group || 'A+',
          address: meta.address || 'Springfield, OR',
          avatar: meta.avatar || `https://images.unsplash.com/photo-${meta.gender === 'Female' ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?w=300&auto=format&fit=crop&q=80`,
          emergencyContact: meta.emergency_contact || 'Family contact',
          bio: meta.bio || 'MediCare verified patient member.'
        };
        setPatient(mappedPatient);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Supabase Login
  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Quick demo account check for instant testing
    if (normalizedEmail === 'patient@hospital.com' && password === 'patient123') {
      setPatient(initialDemoPatient);
      setLoading(false);
      return { success: true, patient: initialDemoPatient };
    }

    try {
      // 2. Direct Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password
      });

      if (error) {
        throw new Error(error.message || 'Invalid email or password in Supabase.');
      }

      if (data?.user) {
        const u = data.user;
        const meta = u.user_metadata || {};
        const mappedPatient = {
          id: u.id,
          name: meta.full_name || meta.name || u.email.split('@')[0],
          email: u.email,
          phone: meta.phone || '+1 (555) 000-0000',
          dateOfBirth: meta.date_of_birth || '1995-01-01',
          gender: meta.gender || 'Not specified',
          bloodGroup: meta.blood_group || 'A+',
          address: meta.address || 'Springfield, OR',
          avatar: meta.avatar || `https://images.unsplash.com/photo-${meta.gender === 'Female' ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?w=300&auto=format&fit=crop&q=80`,
          emergencyContact: meta.emergency_contact || 'Family contact',
          bio: meta.bio || 'MediCare verified patient member.'
        };
        setPatient(mappedPatient);
        setLoading(false);
        return { success: true, patient: mappedPatient };
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Supabase Register
  const register = async (userData) => {
    setLoading(true);
    const normalizedEmail = userData.email.trim().toLowerCase();

    const metadata = {
      full_name: userData.fullName || userData.name,
      phone: userData.phone || '+1 (555) 000-0000',
      date_of_birth: userData.dateOfBirth || '1995-01-01',
      gender: userData.gender || 'Male',
      blood_group: userData.bloodGroup || 'A+',
      address: userData.address || 'Springfield, OR',
      avatar: `https://images.unsplash.com/photo-${userData.gender === 'Female' ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?w=300&auto=format&fit=crop&q=80`,
      emergency_contact: userData.emergencyContact || 'Family contact',
      bio: 'MediCare registered patient member.'
    };

    try {
      // 1. Direct Supabase User Registration
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: userData.password,
        options: {
          data: metadata
        }
      });

      if (error) {
        if (error.message.includes('rate limit') || error.status === 429) {
          throw new Error('Supabase email limiti yetdi. Iltimos, Supabase Dashboard > Authentication > Providers > Email bo‘limida "Confirm email" ni O‘CHIRIB (Disable) qo‘ying.');
        }
        throw new Error(error.message || 'Failed to create user in Supabase.');
      }

      const registeredUser = data?.user;
      if (!registeredUser) {
        throw new Error('Supabase did not return user data.');
      }

      const newPatient = {
        id: registeredUser.id,
        name: metadata.full_name,
        email: normalizedEmail,
        phone: metadata.phone,
        dateOfBirth: metadata.date_of_birth,
        gender: metadata.gender,
        bloodGroup: metadata.blood_group,
        address: metadata.address,
        avatar: metadata.avatar,
        emergencyContact: metadata.emergency_contact,
        bio: metadata.bio
      };

      setPatient(newPatient);
      setLoading(false);
      return { success: true, patient: newPatient };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase sign out error:', e);
    }
    setPatient(null);
    localStorage.removeItem('medicare_patient_user');
  };

  const updateProfile = (updatedFields) => {
    setPatient(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('medicare_patient_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        patient,
        user: patient,
        isAuthenticated: !!patient,
        loading,
        login,
        register,
        logout,
        updateProfile,
        demoPatient: initialDemoPatient
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

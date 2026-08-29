import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [patient, setPatient] = useState(() => {
    try {
      const saved = localStorage.getItem('medicare_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Sync active user to localStorage for instant hydration
  useEffect(() => {
    if (patient) {
      localStorage.setItem('medicare_auth_user', JSON.stringify(patient));
    } else {
      localStorage.removeItem('medicare_auth_user');
    }
  }, [patient]);

  // Helper to construct a unified patient object from Supabase user & profile
  const buildPatientProfile = async (supabaseUser) => {
    if (!supabaseUser) return null;

    const email = supabaseUser.email?.toLowerCase();
    const meta = supabaseUser.user_metadata || {};
    const isUserAdmin = meta.role === 'admin' || email?.includes('admin');

    // Try to fetch patient details from `patients` table in Supabase
    let profileData = {};
    try {
      const { data: dbPatient, error } = await supabase
        .from('patients')
        .select('*')
        .or(`id.eq.${supabaseUser.id},email.eq.${email}`)
        .limit(1)
        .maybeSingle();

      if (dbPatient && !error) {
        profileData = dbPatient;
      }
    } catch (e) {
      console.warn('Could not load db patient profile:', e);
    }

    const rawAvatar = profileData.avatar || meta.avatar || '';
    const sanitizedAvatar = (rawAvatar && rawAvatar.includes('images.unsplash.com/photo-')) ? '' : rawAvatar;

    const mapped = {
      id: supabaseUser.id,
      patientId: profileData.id || `pat-${supabaseUser.id.slice(0, 8)}`,
      role: isUserAdmin ? 'admin' : (profileData.role || meta.role || 'patient'),
      name: profileData.name || meta.full_name || meta.name || email?.split('@')[0] || 'Patient',
      email: email,
      phone: profileData.phone || meta.phone || '',
      dateOfBirth: profileData.date_of_birth || meta.dateOfBirth || meta.date_of_birth || '',
      gender: profileData.gender || meta.gender || 'Not specified',
      bloodGroup: profileData.blood_group || meta.bloodGroup || meta.blood_group || 'O+',
      address: profileData.address || meta.address || '',
      avatar: sanitizedAvatar,
      emergencyContact: profileData.emergency_contact || meta.emergencyContact || meta.emergency_contact || '',
      medicalCondition: profileData.medical_condition || meta.medicalCondition || 'None reported',
      bio: profileData.bio || meta.bio || ''
    };

    return mapped;
  };

  // Initialize and listen to Supabase Auth State
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const profile = await buildPatientProfile(session.user);
          if (isMounted) {
            setPatient(profile);
          }
        } else if (isMounted) {
          // If no active session, clear any stale user
          setPatient(null);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await buildPatientProfile(session.user);
        if (isMounted) {
          setPatient(profile);
          setLoading(false);
        }
      } else {
        if (isMounted) {
          setPatient(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Supabase Login
  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password
      });

      if (error) {
        throw new Error(error.message || 'Invalid email or password.');
      }

      if (data?.user) {
        const profile = await buildPatientProfile(data.user);
        setPatient(profile);
        setLoading(false);
        return { success: true, patient: profile, role: profile.role };
      }

      throw new Error('Could not authenticate user with Supabase.');
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
      full_name: userData.name,
      phone: userData.phone || '',
      dateOfBirth: userData.dateOfBirth || '',
      gender: userData.gender || 'Male',
      bloodGroup: userData.bloodGroup || 'O+',
      address: userData.address || '',
      avatar: userData.avatar || '',
      emergency_contact: userData.emergencyContact || '',
      bio: userData.bio || ''
    };

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: userData.password,
        options: {
          data: metadata
        }
      });

      if (error) {
        if (error.message.includes('rate limit') || error.status === 429) {
          throw new Error('Supabase email rate limit reached. Please disable "Confirm email" in Supabase Auth settings.');
        }
        throw new Error(error.message || 'Failed to create user in Supabase.');
      }

      const registeredUser = data?.user;
      if (!registeredUser) {
        throw new Error('Supabase did not return user data.');
      }

      // Save corresponding patient in public.patients table
      const newPatientRecord = {
        id: registeredUser.id,
        name: metadata.full_name,
        email: normalizedEmail,
        phone: metadata.phone,
        date_of_birth: metadata.dateOfBirth,
        gender: metadata.gender,
        blood_group: metadata.bloodGroup,
        address: metadata.address,
        avatar: metadata.avatar,
        emergency_contact: metadata.emergency_contact,
        medical_condition: 'General Care',
        status: 'Active',
        registered_date: new Date().toISOString().split('T')[0],
        bio: metadata.bio,
        role: 'patient'
      };

      try {
        await supabase.from('patients').upsert(newPatientRecord);
      } catch (dbErr) {
        console.warn('Could not insert to patients table:', dbErr);
      }

      const profile = {
        id: registeredUser.id,
        patientId: registeredUser.id,
        role: 'patient',
        name: metadata.full_name,
        email: normalizedEmail,
        phone: metadata.phone,
        dateOfBirth: metadata.dateOfBirth,
        gender: metadata.gender,
        bloodGroup: metadata.bloodGroup,
        address: metadata.address,
        avatar: metadata.avatar,
        emergencyContact: metadata.emergency_contact,
        bio: metadata.bio
      };

      setPatient(profile);
      setLoading(false);
      return { success: true, patient: profile, role: 'patient' };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Supabase Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase sign out error:', e);
    }
    setPatient(null);
    localStorage.removeItem('medicare_auth_user');
  };

  // Update Profile across Supabase Auth metadata and patients table
  const updateProfile = async (updatedFields) => {
    setPatient(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('medicare_auth_user', JSON.stringify(updated));
      return updated;
    });

    try {
      if (patient?.email || patient?.id) {
        const supaFields = {};
        if (updatedFields.name !== undefined) supaFields.name = updatedFields.name;
        if (updatedFields.phone !== undefined) supaFields.phone = updatedFields.phone;
        if (updatedFields.dateOfBirth !== undefined) supaFields.date_of_birth = updatedFields.dateOfBirth;
        if (updatedFields.gender !== undefined) supaFields.gender = updatedFields.gender;
        if (updatedFields.bloodGroup !== undefined) supaFields.blood_group = updatedFields.bloodGroup;
        if (updatedFields.address !== undefined) supaFields.address = updatedFields.address;
        if (updatedFields.avatar !== undefined) supaFields.avatar = updatedFields.avatar;
        if (updatedFields.emergencyContact !== undefined) supaFields.emergency_contact = updatedFields.emergencyContact;
        if (updatedFields.bio !== undefined) supaFields.bio = updatedFields.bio;

        if (Object.keys(supaFields).length > 0) {
          await supabase
            .from('patients')
            .update(supaFields)
            .or(`id.eq.${patient.id},email.eq.${patient.email}`);
        }

        // Also update auth user metadata
        const authData = {};
        if (updatedFields.name !== undefined) authData.full_name = updatedFields.name;
        if (updatedFields.phone !== undefined) authData.phone = updatedFields.phone;
        if (updatedFields.address !== undefined) authData.address = updatedFields.address;
        if (updatedFields.gender !== undefined) authData.gender = updatedFields.gender;
        if (updatedFields.bloodGroup !== undefined) authData.blood_group = updatedFields.bloodGroup;
        if (updatedFields.bio !== undefined) authData.bio = updatedFields.bio;
        if (updatedFields.avatar !== undefined) authData.avatar = updatedFields.avatar;

        if (Object.keys(authData).length > 0) {
          await supabase.auth.updateUser({
            data: authData
          });
        }
      }
    } catch (err) {
      console.error('Supabase profile update error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        patient,
        user: patient,
        role: patient?.role || 'patient',
        isAdmin: patient?.role === 'admin',
        isAuthenticated: !!patient,
        loading,
        login,
        register,
        logout,
        updateProfile
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

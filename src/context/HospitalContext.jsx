import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';
import {
  initialDoctors,
  initialPatients,
  initialAppointments,
  initialMedicalRecords,
  initialTasks,
  initialNotifications
} from '../data/mockData.js';

const HospitalContext = createContext();

export function HospitalProvider({ children }) {
  const { patient } = useAuth();
  const userId = patient?.id || 'demo-patient';
  const isDemoUser = userId === 'pat-demo-01' || userId === 'pat-101' || userId === 'demo-patient' || patient?.email === 'patient@hospital.com' || patient?.email === 'admin@hospital.com';

  // 1. Doctors Catalog (Admin and Patient shared)
  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem('medicare_doctors');
      return saved ? JSON.parse(saved) : initialDoctors;
    } catch (e) {
      return initialDoctors;
    }
  });

  // 2. Patients List (Admin managed)
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('medicare_patients');
      return saved ? JSON.parse(saved) : initialPatients;
    } catch (e) {
      return initialPatients;
    }
  });

  // 2. Per-User Scoped Tasks (To-Do List)
  const [tasks, setTasks] = useState(() => {
    try {
      const key = `medicare_tasks_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      if (isDemoUser) return initialTasks;
      return [];
    } catch (e) {
      return isDemoUser ? initialTasks : [];
    }
  });

  // 3. Per-User Scoped Appointments
  const [appointments, setAppointments] = useState(() => {
    try {
      const key = `medicare_appointments_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      return isDemoUser ? initialAppointments : [];
    } catch (e) {
      return isDemoUser ? initialAppointments : [];
    }
  });

  // 4. Per-User Scoped Medical Records
  const [medicalRecords, setMedicalRecords] = useState(() => {
    try {
      const key = `medicare_medical_records_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      return isDemoUser ? initialMedicalRecords : [];
    } catch (e) {
      return isDemoUser ? initialMedicalRecords : [];
    }
  });

  // 5. Per-User Scoped Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const key = `medicare_notifications_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      if (isDemoUser) return initialNotifications;
      return [];
    } catch (e) {
      return isDemoUser ? initialNotifications : [];
    }
  });

  // Load doctors & patients from Supabase on mount + seed if empty
  useEffect(() => {
    let isMounted = true;

    const fetchDoctorsFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Supabase doctors fetch error, using localStorage:', error.message);
          return;
        }

        // If Supabase table is empty, seed it with initial mock data
        if (data && data.length === 0 && isMounted) {
          console.log('Seeding doctors table with initial data...');
          const seedRows = initialDoctors.map(doc => ({
            id: doc.id,
            name: doc.name,
            department: doc.department || '',
            specialization: doc.specialization || '',
            experience: doc.experience || '',
            rating: doc.rating || 5.0,
            reviews_count: doc.reviewsCount || 0,
            availability: doc.availability || 'Available Today',
            working_hours: doc.workingHours || '09:00 AM - 05:00 PM',
            fee: doc.fee || '$100',
            education: doc.education || '',
            biography: doc.biography || '',
            avatar: doc.avatar || ''
          }));
          await supabase.from('doctors').insert(seedRows);
          // Keep using initialDoctors from localStorage
          return;
        }

        if (data && data.length > 0 && isMounted) {
          // Merge Supabase data with existing local data to preserve extra fields
          const existingDoctors = doctors;
          const existingMap = {};
          existingDoctors.forEach(doc => { existingMap[doc.id] = doc; });

          const mapped = data.map(d => ({
            ...(existingMap[d.id] || {}), // Keep existing fields (email, phone, languages etc.)
            id: d.id,
            name: d.name,
            department: d.department || existingMap[d.id]?.department || '',
            specialization: d.specialization || existingMap[d.id]?.specialization || '',
            experience: d.experience || existingMap[d.id]?.experience || '',
            rating: parseFloat(d.rating) || existingMap[d.id]?.rating || 5.0,
            reviewsCount: d.reviews_count || existingMap[d.id]?.reviewsCount || 0,
            availability: d.availability || existingMap[d.id]?.availability || 'Available Today',
            workingHours: d.working_hours || existingMap[d.id]?.workingHours || '09:00 AM - 05:00 PM',
            fee: d.fee || existingMap[d.id]?.fee || '$100',
            education: d.education || existingMap[d.id]?.education || '',
            biography: d.biography || existingMap[d.id]?.biography || '',
            avatar: d.avatar || existingMap[d.id]?.avatar || ''
          }));
          setDoctors(mapped);
          localStorage.setItem('medicare_doctors', JSON.stringify(mapped));
        }
      } catch (e) {
        console.log('Supabase doctors fetch fallback to localStorage');
      }
    };

    const fetchPatientsFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Supabase patients fetch error, using localStorage:', error.message);
          return;
        }

        // If Supabase table is empty, seed it with initial mock data
        if (data && data.length === 0 && isMounted) {
          console.log('Seeding patients table with initial data...');
          const seedRows = initialPatients.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email || '',
            phone: p.phone || '',
            date_of_birth: p.dateOfBirth || '',
            gender: p.gender || 'Male',
            blood_group: p.bloodGroup || 'A+',
            address: p.address || '',
            avatar: p.avatar || '',
            emergency_contact: p.emergencyContact || '',
            medical_condition: p.medicalCondition || '',
            status: p.status || 'Active',
            registered_date: p.registeredDate || '',
            bio: p.bio || '',
            role: 'patient'
          }));
          await supabase.from('patients').insert(seedRows);
          // Keep using initialPatients from localStorage
          return;
        }

        if (data && data.length > 0 && isMounted) {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email || '',
            phone: p.phone || '',
            dateOfBirth: p.date_of_birth || '',
            gender: p.gender || 'Male',
            bloodGroup: p.blood_group || 'A+',
            address: p.address || '',
            avatar: p.avatar || '',
            emergencyContact: p.emergency_contact || '',
            medicalCondition: p.medical_condition || '',
            status: p.status || 'Active',
            registeredDate: p.registered_date || '',
            bio: p.bio || '',
            role: 'patient'
          }));
          setPatients(mapped);
          localStorage.setItem('medicare_patients', JSON.stringify(mapped));
        }
      } catch (e) {
        console.log('Supabase patients fetch fallback to localStorage');
      }
    };

    fetchDoctorsFromSupabase();
    fetchPatientsFromSupabase();

    return () => { isMounted = false; };
  }, []);

  // Load user-scoped data from Supabase on Login / Patient Change
  useEffect(() => {
    if (!patient || isDemoUser) return;

    let isMounted = true;

    // Fetch user's tasks from Supabase
    const fetchSupabaseTodos = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped = data.map(t => ({
            id: t.id,
            userId: t.user_id,
            title: t.title,
            description: t.description || '',
            dueDate: t.due_date || '',
            priority: t.priority || 'Medium',
            category: t.category || 'Personal',
            status: t.status || 'Todo'
          }));
          setTasks(mapped);
          localStorage.setItem(`medicare_tasks_${userId}`, JSON.stringify(mapped));
        }
      } catch (e) {
        // Table not created yet or offline
      }
    };

    // Fetch user's appointments from Supabase
    const fetchSupabaseAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped = data.map(a => ({
            id: a.id,
            userId: a.user_id,
            doctorId: a.doctor_id,
            doctorName: a.doctor_name,
            doctorAvatar: a.doctor_avatar,
            department: a.department,
            specialization: a.specialization,
            date: a.date,
            time: a.time,
            reason: a.reason,
            symptoms: a.symptoms,
            status: a.status,
            bookingDate: a.booking_date
          }));
          setAppointments(mapped);
          localStorage.setItem(`medicare_appointments_${userId}`, JSON.stringify(mapped));
        }
      } catch (e) {
        // Fallback
      }
    };

    // Fetch user's notifications from Supabase
    const fetchSupabaseNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped = data.map(n => ({
            id: n.id,
            userId: n.user_id,
            title: n.title,
            message: n.message,
            type: n.type || 'info',
            read: n.read || false,
            timestamp: n.timestamp || 'Just now',
            date: n.date || ''
          }));
          setNotifications(mapped);
          localStorage.setItem(`medicare_notifications_${userId}`, JSON.stringify(mapped));
        }
      } catch (e) {
        // Fallback
      }
    };

    fetchSupabaseTodos();
    fetchSupabaseAppointments();
    fetchSupabaseNotifications();

    return () => {
      isMounted = false;
    };
  }, [userId, isDemoUser, patient]);

  // When active patient changes, sync local state
  useEffect(() => {
    if (!patient) return;

    const taskKey = `medicare_tasks_${userId}`;
    const savedTasks = localStorage.getItem(taskKey);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else if (isDemoUser) {
      setTasks(initialTasks);
    } else {
      const newStarterTasks = [
        {
          id: `task-${Date.now()}-1`,
          userId: userId,
          title: 'Complete Patient Profile & Health Baseline',
          description: 'Review emergency contacts, blood group, and medical history in Settings.',
          dueDate: '2026-08-30',
          priority: 'High',
          category: 'Personal',
          status: 'Todo'
        },
        {
          id: `task-${Date.now()}-2`,
          userId: userId,
          title: 'Schedule First General Consultation',
          description: 'Browse certified physicians and book your initial consultation slot.',
          dueDate: '2026-09-05',
          priority: 'Medium',
          category: 'Medical',
          status: 'Todo'
        }
      ];
      setTasks(newStarterTasks);
      localStorage.setItem(taskKey, JSON.stringify(newStarterTasks));
    }

    const aptKey = `medicare_appointments_${userId}`;
    const savedApts = localStorage.getItem(aptKey);
    if (savedApts) {
      setAppointments(JSON.parse(savedApts));
    } else if (isDemoUser) {
      setAppointments(initialAppointments);
    } else {
      setAppointments([]);
    }

    const notifKey = `medicare_notifications_${userId}`;
    const savedNotifs = localStorage.getItem(notifKey);
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    } else if (isDemoUser) {
      setNotifications(initialNotifications);
    } else {
      const welcomeNotif = [
        {
          id: `notif-${Date.now()}`,
          userId: userId,
          title: 'Welcome to MediCare 🎉',
          message: `Welcome ${patient?.name || 'to MediCare'}! Your personal patient dashboard and to-do workspace are ready.`,
          type: 'success',
          read: false,
          timestamp: 'Just now',
          date: new Date().toISOString().split('T')[0]
        }
      ];
      setNotifications(welcomeNotif);
      localStorage.setItem(notifKey, JSON.stringify(welcomeNotif));
    }
  }, [userId, isDemoUser]);

  // Persist changes locally
  useEffect(() => {
    localStorage.setItem('medicare_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('medicare_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`medicare_tasks_${userId}`, JSON.stringify(tasks));
    }
  }, [tasks, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`medicare_appointments_${userId}`, JSON.stringify(appointments));
    }
  }, [appointments, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`medicare_medical_records_${userId}`, JSON.stringify(medicalRecords));
    }
  }, [medicalRecords, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`medicare_notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, userId]);

  // ==========================================
  // DOCTOR OPERATIONS (ADMIN & SHARED) — SUPABASE SYNCED
  // ==========================================
  const addDoctor = async (doctorData) => {
    const newDoc = {
      id: 'doc-' + Date.now(),
      rating: 5.0,
      reviewsCount: 0,
      availability: 'Available Today',
      availableDays: doctorData.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: doctorData.workingHours || '09:00 AM - 05:00 PM',
      languages: doctorData.languages || ['English', 'Uzbek'],
      avatar: doctorData.avatar || `https://images.unsplash.com/photo-${doctorData.gender === 'Female' ? '1594824813682-be4fb6d43e5e' : '1622253692010-333f2da6031d'}?w=300&auto=format&fit=crop&q=80`,
      ...doctorData
    };

    setDoctors(prev => [newDoc, ...prev]);

    addNotification({
      title: 'New Doctor Added',
      message: `Dr. ${newDoc.name} (${newDoc.specialization || newDoc.department}) has been added to the hospital staff.`,
      type: 'success'
    });

    // Sync to Supabase
    try {
      await supabase.from('doctors').insert({
        id: newDoc.id,
        name: newDoc.name,
        department: newDoc.department || '',
        specialization: newDoc.specialization || '',
        experience: newDoc.experience || '',
        rating: newDoc.rating || 5.0,
        reviews_count: newDoc.reviewsCount || 0,
        availability: newDoc.availability || 'Available Today',
        working_hours: newDoc.workingHours || '09:00 AM - 05:00 PM',
        fee: newDoc.fee || '$100',
        education: newDoc.education || '',
        biography: newDoc.biography || '',
        avatar: newDoc.avatar || ''
      });
    } catch (e) {
      console.log('Supabase doctor insert fallback:', e.message);
    }

    return newDoc;
  };

  const updateDoctor = async (id, updatedFields) => {
    setDoctors(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...updatedFields } : doc))
    );

    // Sync to Supabase
    try {
      const supaFields = {};
      if (updatedFields.name !== undefined) supaFields.name = updatedFields.name;
      if (updatedFields.department !== undefined) supaFields.department = updatedFields.department;
      if (updatedFields.specialization !== undefined) supaFields.specialization = updatedFields.specialization;
      if (updatedFields.experience !== undefined) supaFields.experience = updatedFields.experience;
      if (updatedFields.fee !== undefined) supaFields.fee = updatedFields.fee;
      if (updatedFields.education !== undefined) supaFields.education = updatedFields.education;
      if (updatedFields.biography !== undefined) supaFields.biography = updatedFields.biography;
      if (updatedFields.avatar !== undefined) supaFields.avatar = updatedFields.avatar;
      if (updatedFields.workingHours !== undefined) supaFields.working_hours = updatedFields.workingHours;
      if (updatedFields.rating !== undefined) supaFields.rating = updatedFields.rating;

      if (Object.keys(supaFields).length > 0) {
        await supabase.from('doctors').update(supaFields).eq('id', id);
      }
    } catch (e) {
      console.log('Supabase doctor update fallback:', e.message);
    }
  };

  const deleteDoctor = async (id) => {
    setDoctors(prev => prev.filter(doc => doc.id !== id));
    addNotification({
      title: 'Doctor Removed',
      message: `Doctor record #${id} was removed from hospital directory.`,
      type: 'info'
    });

    // Sync to Supabase
    try {
      await supabase.from('doctors').delete().eq('id', id);
    } catch (e) {
      console.log('Supabase doctor delete fallback:', e.message);
    }
  };

  // ==========================================
  // PATIENT OPERATIONS (ADMIN & SHARED) — SUPABASE SYNCED
  // ==========================================
  const addPatient = async (patientData) => {
    const newPatient = {
      id: 'pat-' + Date.now(),
      status: 'Active',
      registeredDate: new Date().toISOString().split('T')[0],
      avatar: patientData.avatar || `https://images.unsplash.com/photo-${patientData.gender === 'Female' ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?w=300&auto=format&fit=crop&q=80`,
      role: 'patient',
      ...patientData
    };

    setPatients(prev => [newPatient, ...prev]);

    addNotification({
      title: 'New Patient Registered',
      message: `Patient ${newPatient.name} has been enrolled in the hospital system.`,
      type: 'success'
    });

    // Sync to Supabase
    try {
      await supabase.from('patients').insert({
        id: newPatient.id,
        name: newPatient.name,
        email: newPatient.email || '',
        phone: newPatient.phone || '',
        date_of_birth: newPatient.dateOfBirth || '',
        gender: newPatient.gender || 'Male',
        blood_group: newPatient.bloodGroup || 'A+',
        address: newPatient.address || '',
        avatar: newPatient.avatar || '',
        emergency_contact: newPatient.emergencyContact || '',
        medical_condition: newPatient.medicalCondition || '',
        status: newPatient.status || 'Active',
        registered_date: newPatient.registeredDate,
        bio: newPatient.bio || '',
        role: 'patient'
      });
    } catch (e) {
      console.log('Supabase patient insert fallback:', e.message);
    }

    return newPatient;
  };

  const updatePatient = async (id, updatedFields) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    // Sync to Supabase
    try {
      const supaFields = {};
      if (updatedFields.name !== undefined) supaFields.name = updatedFields.name;
      if (updatedFields.email !== undefined) supaFields.email = updatedFields.email;
      if (updatedFields.phone !== undefined) supaFields.phone = updatedFields.phone;
      if (updatedFields.dateOfBirth !== undefined) supaFields.date_of_birth = updatedFields.dateOfBirth;
      if (updatedFields.gender !== undefined) supaFields.gender = updatedFields.gender;
      if (updatedFields.bloodGroup !== undefined) supaFields.blood_group = updatedFields.bloodGroup;
      if (updatedFields.address !== undefined) supaFields.address = updatedFields.address;
      if (updatedFields.avatar !== undefined) supaFields.avatar = updatedFields.avatar;
      if (updatedFields.emergencyContact !== undefined) supaFields.emergency_contact = updatedFields.emergencyContact;
      if (updatedFields.medicalCondition !== undefined) supaFields.medical_condition = updatedFields.medicalCondition;
      if (updatedFields.status !== undefined) supaFields.status = updatedFields.status;
      if (updatedFields.bio !== undefined) supaFields.bio = updatedFields.bio;

      if (Object.keys(supaFields).length > 0) {
        await supabase.from('patients').update(supaFields).eq('id', id);
      }
    } catch (e) {
      console.log('Supabase patient update fallback:', e.message);
    }
  };

  const deletePatient = async (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    addNotification({
      title: 'Patient Record Deleted',
      message: `Patient record #${id} has been archived/removed.`,
      type: 'warning'
    });

    // Sync to Supabase
    try {
      await supabase.from('patients').delete().eq('id', id);
    } catch (e) {
      console.log('Supabase patient delete fallback:', e.message);
    }
  };

  // ==========================================
  // APPOINTMENT OPERATIONS
  // ==========================================
  const updateAppointmentStatus = async (id, status) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );

    addNotification({
      title: `Appointment Status: ${status}`,
      message: `Appointment #${id} status changed to ${status}.`,
      type: status === 'Cancelled' ? 'warning' : 'success'
    });

    try {
      if (!isDemoUser) {
        await supabase.from('appointments').update({ status }).eq('id', id);
      }
    } catch (e) {
      // Fallback
    }
  };

  // ==========================================
  // APPOINTMENT OPERATIONS (SUPABASE SYNCED)
  // ==========================================
  const bookAppointment = async (appointmentData) => {
    const newApt = {
      id: 'apt-' + Date.now(),
      userId: userId,
      status: 'Pending',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      ...appointmentData
    };

    setAppointments(prev => [newApt, ...prev]);

    // Create notification alert
    addNotification({
      title: 'Appointment Requested',
      message: `Your appointment request with ${newApt.doctorName} for ${newApt.date} at ${newApt.time} is pending confirmation.`,
      type: 'info'
    });

    // Sync with Supabase Database
    try {
      if (!isDemoUser) {
        await supabase.from('appointments').insert({
          id: newApt.id,
          user_id: userId,
          doctor_id: newApt.doctorId || 'doc-1',
          doctor_name: newApt.doctorName,
          doctor_avatar: newApt.doctorAvatar || '',
          department: newApt.department || 'General',
          specialization: newApt.specialization || 'Attending Physician',
          date: newApt.date,
          time: newApt.time,
          reason: newApt.reason || '',
          symptoms: newApt.symptoms || '',
          status: 'Pending',
          booking_date: newApt.bookingDate
        });
      }
    } catch (e) {
      // Local fallback active
    }

    return newApt;
  };

  const cancelAppointment = async (id) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          return { ...apt, status: 'Cancelled' };
        }
        return apt;
      })
    );

    const target = appointments.find(a => a.id === id);
    if (target) {
      addNotification({
        title: 'Appointment Cancelled',
        message: `Your appointment with ${target.doctorName} on ${target.date} has been cancelled.`,
        type: 'warning'
      });
    }

    // Sync with Supabase
    try {
      if (!isDemoUser) {
        await supabase.from('appointments').update({ status: 'Cancelled' }).eq('id', id);
      }
    } catch (e) {
      // Fallback
    }
  };

  const getAppointmentById = (id) => {
    return appointments.find(a => a.id === id);
  };

  // ==========================================
  // TASK / TO-DO OPERATIONS (SUPABASE SYNCED)
  // ==========================================
  const addTask = async (taskData) => {
    const newTask = {
      id: 'task-' + Date.now(),
      userId: userId,
      status: taskData.status || 'Todo',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'Personal',
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);

    // Sync to Supabase
    try {
      if (!isDemoUser) {
        await supabase.from('todos').insert({
          id: newTask.id,
          user_id: userId,
          title: newTask.title,
          description: newTask.description || '',
          due_date: newTask.dueDate || null,
          priority: newTask.priority || 'Medium',
          category: newTask.category || 'Personal',
          status: newTask.status || 'Todo'
        });
      }
    } catch (e) {
      // Local persistence fallback
    }

    return newTask;
  };

  const updateTask = async (id, updatedFields) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return { ...t, ...updatedFields };
        }
        return t;
      })
    );

    // Sync to Supabase
    try {
      if (!isDemoUser) {
        await supabase.from('todos').update({
          title: updatedFields.title,
          description: updatedFields.description,
          due_date: updatedFields.dueDate,
          priority: updatedFields.priority,
          category: updatedFields.category,
          status: updatedFields.status
        }).eq('id', id);
      }
    } catch (e) {
      // Fallback
    }
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));

    // Sync to Supabase
    try {
      if (!isDemoUser) {
        await supabase.from('todos').delete().eq('id', id);
      }
    } catch (e) {
      // Fallback
    }
  };

  const toggleTaskStatus = async (id) => {
    let nextStatus = 'Completed';
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          nextStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );

    // Sync to Supabase
    try {
      if (!isDemoUser) {
        await supabase.from('todos').update({ status: nextStatus }).eq('id', id);
      }
    } catch (e) {
      // Fallback
    }
  };

  // ==========================================
  // NOTIFICATION OPERATIONS (SUPABASE SYNCED)
  // ==========================================
  const addNotification = async ({ title, message, type = 'info' }) => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      userId: userId,
      title,
      message,
      type,
      read: false,
      timestamp: 'Just now',
      date: new Date().toISOString().split('T')[0]
    };

    setNotifications(prev => [newNotif, ...prev]);

    try {
      if (!isDemoUser) {
        await supabase.from('notifications').insert({
          id: newNotif.id,
          user_id: userId,
          title: newNotif.title,
          message: newNotif.message,
          type: newNotif.type,
          read: false,
          timestamp: newNotif.timestamp,
          date: newNotif.date
        });
      }
    } catch (e) {
      // Fallback
    }
  };

  const markNotificationAsRead = async (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));

    try {
      if (!isDemoUser) {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      }
    } catch (e) {
      // Fallback
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      if (!isDemoUser) {
        await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
      }
    } catch (e) {
      // Fallback
    }
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      if (!isDemoUser) {
        await supabase.from('notifications').delete().eq('id', id);
      }
    } catch (e) {
      // Fallback
    }
  };

  // Computed metrics for active patient & admin
  const upcomingList = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const completedList = appointments.filter(a => a.status === 'Completed');
  const pendingList = appointments.filter(a => a.status === 'Pending');
  const cancelledList = appointments.filter(a => a.status === 'Cancelled');

  const stats = {
    upcomingAppointments: upcomingList.length,
    completedAppointments: completedList.length,
    availableDoctors: doctors.length,
    pendingAppointments: pendingList.length
  };

  const adminStats = {
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    totalAppointments: appointments.length,
    pendingAppointments: pendingList.length,
    confirmedAppointments: appointments.filter(a => a.status === 'Confirmed').length,
    completedAppointments: completedList.length,
    cancelledAppointments: cancelledList.length
  };

  // Featured next upcoming appointment for active patient
  const nextAppointment = appointments.find(a => a.status === 'Confirmed' || a.status === 'Pending') || appointments[0] || null;

  return (
    <HospitalContext.Provider
      value={{
        doctors,
        patients,
        appointments,
        medicalRecords,
        tasks,
        notifications,
        stats,
        adminStats,
        nextAppointment,
        userId,
        // Doctor methods (Admin)
        addDoctor,
        updateDoctor,
        deleteDoctor,
        // Patient methods (Admin)
        addPatient,
        updatePatient,
        deletePatient,
        // Appointment methods
        bookAppointment,
        cancelAppointment,
        getAppointmentById,
        updateAppointmentStatus,
        // Task methods
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        // Notification methods
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}

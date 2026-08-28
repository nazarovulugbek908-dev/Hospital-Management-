import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';
import {
  initialDoctors,
  initialAppointments,
  initialMedicalRecords,
  initialTasks,
  initialNotifications
} from '../data/mockData.js';

const HospitalContext = createContext();

export function HospitalProvider({ children }) {
  const { patient } = useAuth();
  const userId = patient?.id || 'demo-patient';
  const isDemoUser = userId === 'pat-demo-01' || userId === 'demo-patient' || patient?.email === 'patient@hospital.com';

  // 1. Doctors Catalog
  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem('medicare_doctors');
      return saved ? JSON.parse(saved) : initialDoctors;
    } catch (e) {
      return initialDoctors;
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

  // Load from Supabase on Login / Patient Change
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

  // Computed metrics for active patient
  const upcomingList = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const completedList = appointments.filter(a => a.status === 'Completed');
  const pendingList = appointments.filter(a => a.status === 'Pending');

  const stats = {
    upcomingAppointments: upcomingList.length,
    completedAppointments: completedList.length,
    availableDoctors: doctors.length,
    pendingAppointments: pendingList.length
  };

  // Featured next upcoming appointment for active patient
  const nextAppointment = appointments.find(a => a.status === 'Confirmed' || a.status === 'Pending') || appointments[0] || null;

  return (
    <HospitalContext.Provider
      value={{
        doctors,
        appointments,
        medicalRecords,
        tasks,
        notifications,
        stats,
        nextAppointment,
        userId,
        // Appointment methods
        bookAppointment,
        cancelAppointment,
        getAppointmentById,
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

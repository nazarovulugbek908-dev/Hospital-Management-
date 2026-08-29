import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';
import { initialDoctors, initialPatients } from '../data/mockData.js';

const HospitalContext = createContext();

export function HospitalProvider({ children }) {
  const { patient, isAuthenticated, isAdmin } = useAuth();
  const userId = patient?.id;

  // Primary State Containers (Backed by Supabase)
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Active channel reference for cleanup
  const realtimeChannelRef = useRef(null);

  // =========================================================
  // 1. DATA FETCHING FROM SUPABASE
  // =========================================================

  // Fetch Doctors Catalog
  const fetchDoctors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        if (data.length === 0) {
          // If doctors table is empty, seed with initial catalog
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
          setDoctors(initialDoctors);
        } else {
          const mapped = data.map(d => ({
            id: d.id,
            name: d.name,
            department: d.department || 'General Medicine',
            specialization: d.specialization || 'Attending Specialist',
            experience: d.experience || '5+ years experience',
            experienceYears: parseInt(d.experience) || 5,
            rating: parseFloat(d.rating) || 5.0,
            reviewsCount: d.reviews_count || 0,
            availability: d.availability || 'Available Today',
            availableDays: d.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            workingHours: d.working_hours || '09:00 AM - 05:00 PM',
            languages: d.languages || ['English', 'Uzbek'],
            fee: d.fee || '$100',
            education: d.education || 'MD, Medical School Graduate',
            biography: d.biography || 'Specialist healthcare professional at MediCare Hospital.',
            avatar: d.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
            email: d.email || `${d.name.toLowerCase().replace(/[^a-z]/g, '')}@medicare.org`,
            phone: d.phone || '+1 (555) 234-5678'
          }));
          setDoctors(mapped);
        }
      }
    } catch (e) {
      console.error('Error fetching doctors from Supabase:', e);
    }
  }, []);

  // Fetch Patients List
  const fetchPatients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        if (data.length === 0) {
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
            registered_date: p.registeredDate || new Date().toISOString().split('T')[0],
            bio: p.bio || '',
            role: 'patient'
          }));
          await supabase.from('patients').insert(seedRows);
          setPatients(initialPatients);
        } else {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email || '',
            phone: p.phone || '+1 (555) 000-0000',
            dateOfBirth: p.date_of_birth || '1995-01-01',
            gender: p.gender || 'Male',
            bloodGroup: p.blood_group || 'O+',
            address: p.address || 'Springfield, OR',
            avatar: p.avatar || `https://images.unsplash.com/photo-${p.gender === 'Female' ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?w=300&auto=format&fit=crop&q=80`,
            emergencyContact: p.emergency_contact || 'Family member',
            medicalCondition: p.medical_condition || 'General Care',
            status: p.status || 'Active',
            registeredDate: p.registered_date || p.created_at?.split('T')[0] || '2026-01-01',
            bio: p.bio || 'MediCare patient member.',
            role: p.role || 'patient'
          }));
          setPatients(mapped);
        }
      }
    } catch (e) {
      console.error('Error fetching patients from Supabase:', e);
    }
  }, []);

  // Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });

      // If user is regular patient, fetch their appointments + any matches by email/user_id
      if (userId && !isAdmin) {
        query = query.or(`user_id.eq.${userId},user_id.eq.${patient?.email}`);
      }

      const { data, error } = await query;
      if (!error && data) {
        const mapped = data.map(a => ({
          id: a.id,
          userId: a.user_id,
          doctorId: a.doctor_id || 'doc-1',
          doctorName: a.doctor_name,
          doctorAvatar: a.doctor_avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
          department: a.department || 'General Medicine',
          specialization: a.specialization || 'Attending Physician',
          date: a.date,
          time: a.time,
          reason: a.reason || 'Routine consultation',
          symptoms: a.symptoms || '',
          status: a.status || 'Pending',
          bookingDate: a.booking_date || a.created_at?.split('T')[0] || 'Recently'
        }));
        setAppointments(mapped);
      }
    } catch (e) {
      console.error('Error fetching appointments from Supabase:', e);
    }
  }, [userId, isAdmin, patient?.email]);

  // Fetch Todos / Tasks
  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.${patient?.email}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
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
      }
    } catch (e) {
      console.error('Error fetching tasks from Supabase:', e);
    }
  }, [userId, patient?.email]);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.${patient?.email}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(n => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type || 'info',
          read: n.read || false,
          timestamp: n.timestamp || 'Just now',
          date: n.date || n.created_at?.split('T')[0] || 'Today'
        }));
        setNotifications(mapped);
      }
    } catch (e) {
      console.error('Error fetching notifications from Supabase:', e);
    }
  }, [userId, patient?.email]);

  // Fetch Medical Records
  const fetchMedicalRecords = useCallback(async () => {
    if (!userId) {
      setMedicalRecords([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.${patient?.email}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(r => ({
          id: r.id,
          userId: r.user_id,
          date: r.date,
          doctor: r.doctor,
          department: r.department,
          diagnosis: r.diagnosis,
          recommendations: r.recommendations || '',
          doctorNotes: r.doctor_notes || ''
        }));
        setMedicalRecords(mapped);
      }
    } catch (e) {
      console.error('Error fetching medical records from Supabase:', e);
    }
  }, [userId, patient?.email]);

  // Load all data on mount or when user/role changes
  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      setLoadingData(true);
      await Promise.all([
        fetchDoctors(),
        fetchPatients(),
        fetchAppointments(),
        fetchTasks(),
        fetchNotifications(),
        fetchMedicalRecords()
      ]);
      if (isMounted) setLoadingData(false);
    };

    loadAll();

    return () => { isMounted = false; };
  }, [fetchDoctors, fetchPatients, fetchAppointments, fetchTasks, fetchNotifications, fetchMedicalRecords]);

  // =========================================================
  // 2. SUPABASE REALTIME MULTI-TAB SYNCHRONIZATION
  // =========================================================
  useEffect(() => {
    // Create a centralized realtime subscription channel
    const channel = supabase
      .channel('medicare_realtime_channel')
      // 1. Doctors realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'doctors' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const d = payload.new;
            const newDoc = {
              id: d.id,
              name: d.name,
              department: d.department || 'General Medicine',
              specialization: d.specialization || 'Attending Specialist',
              experience: d.experience || '5+ years experience',
              experienceYears: parseInt(d.experience) || 5,
              rating: parseFloat(d.rating) || 5.0,
              reviewsCount: d.reviews_count || 0,
              availability: d.availability || 'Available Today',
              availableDays: d.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              workingHours: d.working_hours || '09:00 AM - 05:00 PM',
              languages: d.languages || ['English', 'Uzbek'],
              fee: d.fee || '$100',
              education: d.education || 'MD Graduate',
              biography: d.biography || '',
              avatar: d.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
              email: d.email || `${d.name.toLowerCase().replace(/[^a-z]/g, '')}@medicare.org`,
              phone: d.phone || '+1 (555) 234-5678'
            };
            setDoctors(prev => {
              if (prev.some(x => x.id === newDoc.id)) return prev;
              return [newDoc, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const d = payload.new;
            setDoctors(prev => prev.map(x => x.id === d.id ? { ...x, ...d, reviewsCount: d.reviews_count, workingHours: d.working_hours } : x));
          } else if (payload.eventType === 'DELETE') {
            setDoctors(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      // 2. Patients realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const p = payload.new;
            const newPat = {
              id: p.id,
              name: p.name,
              email: p.email || '',
              phone: p.phone || '+1 (555) 000-0000',
              dateOfBirth: p.date_of_birth || '1995-01-01',
              gender: p.gender || 'Male',
              bloodGroup: p.blood_group || 'O+',
              address: p.address || 'Springfield, OR',
              avatar: p.avatar || `https://images.unsplash.com/photo-${p.gender === 'Female' ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?w=300&auto=format&fit=crop&q=80`,
              emergencyContact: p.emergency_contact || 'Family member',
              medicalCondition: p.medical_condition || 'General Care',
              status: p.status || 'Active',
              registeredDate: p.registered_date || p.created_at?.split('T')[0] || '2026-01-01',
              bio: p.bio || 'MediCare patient member.',
              role: p.role || 'patient'
            };
            setPatients(prev => {
              if (prev.some(x => x.id === newPat.id)) return prev;
              return [newPat, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const p = payload.new;
            setPatients(prev => prev.map(x => x.id === p.id ? { ...x, ...p, dateOfBirth: p.date_of_birth, bloodGroup: p.blood_group, emergencyContact: p.emergency_contact, medicalCondition: p.medical_condition } : x));
          } else if (payload.eventType === 'DELETE') {
            setPatients(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      // 3. Appointments realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const a = payload.new;
            const newApt = {
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
            };
            // If admin or matching user
            if (isAdmin || a.user_id === userId || a.user_id === patient?.email) {
              setAppointments(prev => {
                if (prev.some(x => x.id === newApt.id)) return prev;
                return [newApt, ...prev];
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const a = payload.new;
            setAppointments(prev => prev.map(x => x.id === a.id ? { ...x, ...a, userId: a.user_id, doctorId: a.doctor_id, doctorName: a.doctor_name, bookingDate: a.booking_date } : x));
          } else if (payload.eventType === 'DELETE') {
            setAppointments(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      // 4. Tasks (Todos) realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const t = payload.new;
            if (t.user_id === userId || t.user_id === patient?.email) {
              const newTask = {
                id: t.id,
                userId: t.user_id,
                title: t.title,
                description: t.description || '',
                dueDate: t.due_date || '',
                priority: t.priority || 'Medium',
                category: t.category || 'Personal',
                status: t.status || 'Todo'
              };
              setTasks(prev => {
                if (prev.some(x => x.id === newTask.id)) return prev;
                return [newTask, ...prev];
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const t = payload.new;
            if (t.user_id === userId || t.user_id === patient?.email) {
              setTasks(prev => prev.map(x => x.id === t.id ? { ...x, title: t.title, description: t.description, dueDate: t.due_date, priority: t.priority, category: t.category, status: t.status } : x));
            }
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      // 5. Notifications realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const n = payload.new;
            if (n.user_id === userId || n.user_id === patient?.email) {
              const newNotif = {
                id: n.id,
                userId: n.user_id,
                title: n.title,
                message: n.message,
                type: n.type || 'info',
                read: n.read || false,
                timestamp: n.timestamp || 'Just now',
                date: n.date || 'Today'
              };
              setNotifications(prev => {
                if (prev.some(x => x.id === newNotif.id)) return prev;
                return [newNotif, ...prev];
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const n = payload.new;
            setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: n.read, title: n.title, message: n.message } : x));
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      // 6. Medical records realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medical_records' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const r = payload.new;
            if (r.user_id === userId || r.user_id === patient?.email) {
              const newRec = {
                id: r.id,
                userId: r.user_id,
                date: r.date,
                doctor: r.doctor,
                department: r.department,
                diagnosis: r.diagnosis,
                recommendations: r.recommendations || '',
                doctorNotes: r.doctor_notes || ''
              };
              setMedicalRecords(prev => {
                if (prev.some(x => x.id === newRec.id)) return prev;
                return [newRec, ...prev];
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const r = payload.new;
            setMedicalRecords(prev => prev.map(x => x.id === r.id ? { ...x, date: r.date, doctor: r.doctor, department: r.department, diagnosis: r.diagnosis, recommendations: r.recommendations, doctorNotes: r.doctor_notes } : x));
          } else if (payload.eventType === 'DELETE') {
            setMedicalRecords(prev => prev.filter(x => x.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Channel connected
        }
      });

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [userId, isAdmin, patient?.email]);

  // =========================================================
  // 3. DOCTOR OPERATIONS (ADMIN & SHARED) — SUPABASE
  // =========================================================
  const addDoctor = async (doctorData) => {
    const newDoc = {
      id: 'doc-' + Date.now(),
      name: doctorData.name,
      department: doctorData.department || 'General Medicine',
      specialization: doctorData.specialization || 'Attending Physician',
      experience: doctorData.experience || `${doctorData.experienceYears || 5} years experience`,
      experienceYears: doctorData.experienceYears || 5,
      rating: 5.0,
      reviewsCount: 0,
      availability: doctorData.availability || 'Available Today',
      availableDays: doctorData.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: doctorData.workingHours || '09:00 AM - 05:00 PM',
      languages: doctorData.languages || ['English', 'Uzbek'],
      fee: doctorData.fee || '$100',
      education: doctorData.education || 'MD, Medical School Graduate',
      biography: doctorData.biography || '',
      avatar: doctorData.avatar || `https://images.unsplash.com/photo-${doctorData.gender === 'Female' ? '1594824813682-be4fb6d43e5e' : '1622253692010-333f2da6031d'}?w=300&auto=format&fit=crop&q=80`,
      email: doctorData.email || `${doctorData.name.toLowerCase().replace(/[^a-z]/g, '')}@medicare.org`,
      phone: doctorData.phone || '+1 (555) 234-5678'
    };

    // Optimistic update
    setDoctors(prev => [newDoc, ...prev]);

    // Insert to Supabase
    try {
      const { error } = await supabase.from('doctors').insert({
        id: newDoc.id,
        name: newDoc.name,
        department: newDoc.department,
        specialization: newDoc.specialization,
        experience: newDoc.experience,
        rating: newDoc.rating,
        reviews_count: newDoc.reviewsCount,
        availability: newDoc.availability,
        working_hours: newDoc.workingHours,
        fee: newDoc.fee,
        education: newDoc.education,
        biography: newDoc.biography,
        avatar: newDoc.avatar
      });

      if (error) throw error;
    } catch (e) {
      console.error('Supabase doctor insert error:', e.message);
    }

    return newDoc;
  };

  const updateDoctor = async (id, updatedFields) => {
    // Optimistic update
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
        const { error } = await supabase.from('doctors').update(supaFields).eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.error('Supabase doctor update error:', e.message);
    }
  };

  const deleteDoctor = async (id) => {
    // Optimistic update
    setDoctors(prev => prev.filter(doc => doc.id !== id));

    // Delete in Supabase
    try {
      const { error } = await supabase.from('doctors').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase doctor delete error:', e.message);
    }
  };

  // =========================================================
  // 4. PATIENT OPERATIONS (ADMIN & SHARED) — SUPABASE
  // =========================================================
  const addPatient = async (patientData) => {
    const newPatient = {
      id: 'pat-' + Date.now(),
      status: patientData.status || 'Active',
      registeredDate: new Date().toISOString().split('T')[0],
      avatar: patientData.avatar || '',
      role: 'patient',
      ...patientData
    };

    // Optimistic update
    setPatients(prev => [newPatient, ...prev]);

    // Insert to Supabase
    try {
      const { error } = await supabase.from('patients').insert({
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
        medical_condition: newPatient.medicalCondition || 'General Care',
        status: newPatient.status || 'Active',
        registered_date: newPatient.registeredDate,
        bio: newPatient.bio || '',
        role: 'patient'
      });

      if (error) throw error;
    } catch (e) {
      console.error('Supabase patient insert error:', e.message);
    }

    return newPatient;
  };

  const updatePatient = async (id, updatedFields) => {
    // Optimistic update
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
        const { error } = await supabase.from('patients').update(supaFields).eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.error('Supabase patient update error:', e.message);
    }
  };

  const deletePatient = async (id) => {
    // Optimistic update
    setPatients(prev => prev.filter(p => p.id !== id));

    // Delete in Supabase
    try {
      const { error } = await supabase.from('patients').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase patient delete error:', e.message);
    }
  };

  // =========================================================
  // 5. APPOINTMENT OPERATIONS (SUPABASE)
  // =========================================================
  const bookAppointment = async (appointmentData) => {
    const activeUserId = userId || patient?.email || 'user-' + Date.now();
    const newApt = {
      id: 'apt-' + Date.now(),
      userId: activeUserId,
      status: 'Pending',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      ...appointmentData
    };

    // Optimistic update
    setAppointments(prev => [newApt, ...prev]);

    // Add alert notification
    await addNotification({
      title: 'Appointment Requested',
      message: `Your appointment request with ${newApt.doctorName} for ${newApt.date} at ${newApt.time} is pending confirmation.`,
      type: 'info'
    });

    // Insert to Supabase Database
    try {
      const { error } = await supabase.from('appointments').insert({
        id: newApt.id,
        user_id: activeUserId,
        doctor_id: newApt.doctorId || 'doc-1',
        doctor_name: newApt.doctorName,
        doctor_avatar: newApt.doctorAvatar || '',
        department: newApt.department || 'General Medicine',
        specialization: newApt.specialization || 'Attending Specialist',
        date: newApt.date,
        time: newApt.time,
        reason: newApt.reason || 'General Consultation',
        symptoms: newApt.symptoms || '',
        status: 'Pending',
        booking_date: newApt.bookingDate
      });

      if (error) throw error;
    } catch (e) {
      console.error('Supabase book appointment error:', e.message);
    }

    return newApt;
  };

  const updateAppointmentStatus = async (id, status) => {
    // Optimistic update
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );

    const target = appointments.find(a => a.id === id);
    if (target) {
      await addNotification({
        title: `Appointment Status: ${status}`,
        message: `Appointment #${id} with ${target.doctorName} changed to ${status}.`,
        type: status === 'Cancelled' ? 'warning' : 'success'
      });
    }

    // Sync to Supabase
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase update appointment error:', e.message);
    }
  };

  const cancelAppointment = async (id) => {
    return updateAppointmentStatus(id, 'Cancelled');
  };

  const getAppointmentById = (id) => {
    return appointments.find(a => a.id === id);
  };

  // =========================================================
  // 6. TASK / TO-DO OPERATIONS (SUPABASE)
  // =========================================================
  const addTask = async (taskData) => {
    const activeUserId = userId || patient?.email || 'user-' + Date.now();
    const newTask = {
      id: 'task-' + Date.now(),
      userId: activeUserId,
      status: taskData.status || 'Todo',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'Personal',
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || ''
    };

    // Optimistic update
    setTasks(prev => [newTask, ...prev]);

    // Insert to Supabase
    try {
      const { error } = await supabase.from('todos').insert({
        id: newTask.id,
        user_id: activeUserId,
        title: newTask.title,
        description: newTask.description || '',
        due_date: newTask.dueDate || null,
        priority: newTask.priority || 'Medium',
        category: newTask.category || 'Personal',
        status: newTask.status || 'Todo'
      });

      if (error) throw error;
    } catch (e) {
      console.error('Supabase add task error:', e.message);
    }

    return newTask;
  };

  const updateTask = async (id, updatedFields) => {
    // Optimistic update
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updatedFields } : t))
    );

    // Sync to Supabase
    try {
      const supaFields = {};
      if (updatedFields.title !== undefined) supaFields.title = updatedFields.title;
      if (updatedFields.description !== undefined) supaFields.description = updatedFields.description;
      if (updatedFields.dueDate !== undefined) supaFields.due_date = updatedFields.dueDate;
      if (updatedFields.priority !== undefined) supaFields.priority = updatedFields.priority;
      if (updatedFields.category !== undefined) supaFields.category = updatedFields.category;
      if (updatedFields.status !== undefined) supaFields.status = updatedFields.status;

      if (Object.keys(supaFields).length > 0) {
        const { error } = await supabase.from('todos').update(supaFields).eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.error('Supabase update task error:', e.message);
    }
  };

  const deleteTask = async (id) => {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));

    // Delete in Supabase
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase delete task error:', e.message);
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
      const { error } = await supabase.from('todos').update({ status: nextStatus }).eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase toggle task error:', e.message);
    }
  };

  // =========================================================
  // 7. NOTIFICATION OPERATIONS (SUPABASE)
  // =========================================================
  const addNotification = async ({ title, message, type = 'info' }) => {
    const activeUserId = userId || patient?.email || 'user-' + Date.now();
    const newNotif = {
      id: 'notif-' + Date.now(),
      userId: activeUserId,
      title,
      message,
      type,
      read: false,
      timestamp: 'Just now',
      date: new Date().toISOString().split('T')[0]
    };

    // Optimistic update
    setNotifications(prev => [newNotif, ...prev]);

    // Insert to Supabase
    try {
      const { error } = await supabase.from('notifications').insert({
        id: newNotif.id,
        user_id: activeUserId,
        title: newNotif.title,
        message: newNotif.message,
        type: newNotif.type,
        read: false,
        timestamp: newNotif.timestamp,
        date: newNotif.date
      });

      if (error) throw error;
    } catch (e) {
      console.error('Supabase notification insert error:', e.message);
    }

    return newNotif;
  };

  const markNotificationAsRead = async (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));

    try {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase mark notification error:', e.message);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      const activeUserId = userId || patient?.email;
      if (activeUserId) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .or(`user_id.eq.${activeUserId},user_id.eq.${patient?.email}`);
        if (error) throw error;
      }
    } catch (e) {
      console.error('Supabase mark all notifications error:', e.message);
    }
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase delete notification error:', e.message);
    }
  };

  // =========================================================
  // 8. MEDICAL RECORDS OPERATIONS (SUPABASE)
  // =========================================================
  const addMedicalRecord = async (recordData) => {
    const activeUserId = userId || patient?.email || 'user-' + Date.now();
    const newRecord = {
      id: 'rec-' + Date.now(),
      userId: activeUserId,
      date: recordData.date || new Date().toISOString().split('T')[0],
      doctor: recordData.doctor || 'Dr. Medical Specialist',
      department: recordData.department || 'General Medicine',
      diagnosis: recordData.diagnosis || 'Clinical Checkup',
      recommendations: recordData.recommendations || 'Standard health observation.',
      doctorNotes: recordData.doctorNotes || ''
    };

    setMedicalRecords(prev => [newRecord, ...prev]);

    try {
      const { error } = await supabase.from('medical_records').insert({
        id: newRecord.id,
        user_id: activeUserId,
        date: newRecord.date,
        doctor: newRecord.doctor,
        department: newRecord.department,
        diagnosis: newRecord.diagnosis,
        recommendations: newRecord.recommendations,
        doctor_notes: newRecord.doctorNotes
      });

      if (error) throw error;
    } catch (e) {
      console.error('Supabase add medical record error:', e.message);
    }

    return newRecord;
  };

  const updateMedicalRecord = async (id, updatedFields) => {
    setMedicalRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updatedFields } : r))
    );

    try {
      const supaFields = {};
      if (updatedFields.date !== undefined) supaFields.date = updatedFields.date;
      if (updatedFields.doctor !== undefined) supaFields.doctor = updatedFields.doctor;
      if (updatedFields.department !== undefined) supaFields.department = updatedFields.department;
      if (updatedFields.diagnosis !== undefined) supaFields.diagnosis = updatedFields.diagnosis;
      if (updatedFields.recommendations !== undefined) supaFields.recommendations = updatedFields.recommendations;
      if (updatedFields.doctorNotes !== undefined) supaFields.doctor_notes = updatedFields.doctorNotes;

      if (Object.keys(supaFields).length > 0) {
        const { error } = await supabase.from('medical_records').update(supaFields).eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.error('Supabase update medical record error:', e.message);
      throw e;
    }
  };

  const deleteMedicalRecord = async (id) => {
    setMedicalRecords(prev => prev.filter(r => r.id !== id));

    try {
      const { error } = await supabase.from('medical_records').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Supabase delete medical record error:', e.message);
      throw e;
    }
  };

  // =========================================================
  // 9. COMPUTED METRICS & STATS
  // =========================================================
  const upcomingList = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const completedList = appointments.filter(a => a.status === 'Completed');
  const pendingList = appointments.filter(a => a.status === 'Pending');

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
    cancelledAppointments: appointments.filter(a => a.status === 'Cancelled').length
  };

  const nextAppointment = upcomingList[0] || appointments[0] || null;

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
        loadingData,
        userId,
        // Doctor operations
        addDoctor,
        updateDoctor,
        deleteDoctor,
        // Patient operations
        addPatient,
        updatePatient,
        deletePatient,
        // Appointment operations
        bookAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        getAppointmentById,
        // Task operations
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        // Notification operations
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        // Medical records operations
        addMedicalRecord,
        updateMedicalRecord,
        deleteMedicalRecord,
        // Refresh triggers
        refreshAll: () => {
          fetchDoctors();
          fetchPatients();
          fetchAppointments();
          fetchTasks();
          fetchNotifications();
          fetchMedicalRecords();
        }
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

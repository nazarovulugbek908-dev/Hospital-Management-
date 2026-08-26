// API Client Service for Hospital Management System
// Supports both Doctor Panel and Patient Panel with simulated REST API network latency

import {
  getStoredDoctors,
  getStoredPatients,
  getStoredAppointments,
  updateStoredDoctor,
  updateStoredPatient,
  updateStoredAppointment,
  cancelStoredAppointment,
  saveStoredDiagnosis,
  getAvailableSlotsForDoctor,
  createStoredAppointment,
  getCurrentUser,
  setCurrentUser
} from './backendStore.js';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Authentication methods
  async login(email, password) {
    await delay(400);
    const doctors = getStoredDoctors();
    const doctor = doctors.find(d => d.email.toLowerCase() === email.toLowerCase());

    if (doctor) {
      const user = {
        id: doctor.userId || 'user-doc-1',
        doctorId: doctor.id,
        name: doctor.fullName,
        email: doctor.email,
        role: 'doctor',
        token: `jwt_token_${doctor.id}_${Date.now()}`
      };
      setCurrentUser(user);
      return user;
    }

    const patients = getStoredPatients();
    const patient = patients.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (patient) {
      const user = {
        id: patient.userId || 'user-pat-1',
        patientId: patient.id,
        name: patient.fullName,
        email: patient.email,
        role: 'patient',
        token: `jwt_token_${patient.id}_${Date.now()}`
      };
      setCurrentUser(user);
      return user;
    }

    // Default to first patient if unknown
    const defaultPatient = patients[0];
    const user = {
      id: defaultPatient.userId || 'user-pat-1',
      patientId: defaultPatient.id,
      name: defaultPatient.fullName,
      email: defaultPatient.email,
      role: 'patient',
      token: `jwt_token_${defaultPatient.id}_${Date.now()}`
    };
    setCurrentUser(user);
    return user;
  },

  // DOCTOR API ENDPOINTS
  async getCurrentDoctorProfile(doctorId) {
    await delay(250);
    const doctors = getStoredDoctors();
    return doctors.find(d => d.id === doctorId || d.userId === doctorId) || doctors[0];
  },

  async updateDoctorProfile(doctorId, profileData) {
    await delay(350);
    if (!profileData.fullName || !profileData.email || !profileData.phone) {
      throw new Error('Full Name, Email, and Phone Number are required fields.');
    }
    return updateStoredDoctor(doctorId, profileData);
  },

  async getDoctorStats(doctorId) {
    await delay(250);
    const appointments = getStoredAppointments().filter(a => a.doctorId === doctorId);
    const patients = getStoredPatients().filter(p => p.doctorId === doctorId);
    const todayStr = new Date().toISOString().split('T')[0];

    const todayAppointments = appointments.filter(a => a.date === todayStr);
    const upcomingAppointments = appointments.filter(a => a.date > todayStr && a.status !== 'Cancelled');
    const completedAppointments = appointments.filter(a => a.status === 'Completed');
    const pendingAppointments = appointments.filter(a => a.status === 'Pending');

    return {
      totalPatients: patients.length,
      todayAppointments: todayAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      completedAppointments: completedAppointments.length,
      pendingAppointments: pendingAppointments.length,
      todayList: todayAppointments
    };
  },

  async getDoctorPatients(doctorId, search = '', statusFilter = 'All', genderFilter = 'All') {
    await delay(300);
    let patients = getStoredPatients().filter(p => p.doctorId === doctorId);
    const appointments = getStoredAppointments().filter(a => a.doctorId === doctorId);

    patients = patients.map(patient => {
      const pAppointments = appointments.filter(a => a.patientId === patient.id);
      const latestAppt = pAppointments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      return {
        ...patient,
        latestAppointmentDate: latestAppt ? `${latestAppt.date} (${latestAppt.time})` : 'N/A',
        appointmentStatus: latestAppt ? latestAppt.status : 'Active'
      };
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      patients = patients.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }

    if (genderFilter !== 'All') {
      patients = patients.filter(p => p.gender.toLowerCase() === genderFilter.toLowerCase());
    }

    if (statusFilter !== 'All') {
      patients = patients.filter(p => p.appointmentStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    return patients;
  },

  async getPatientDetails(patientId, doctorId) {
    await delay(250);
    const patients = getStoredPatients();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) throw new Error('Patient record not found');
    if (doctorId && patient.doctorId && patient.doctorId !== doctorId) {
      // Access check
    }

    const appointments = getStoredAppointments().filter(a => a.patientId === patientId);
    return {
      ...patient,
      appointmentHistory: appointments
    };
  },

  async getDoctorAppointments(doctorId, statusTab = 'All') {
    await delay(300);
    let appointments = getStoredAppointments().filter(a => a.doctorId === doctorId);
    const todayStr = new Date().toISOString().split('T')[0];

    if (statusTab === 'Today') {
      appointments = appointments.filter(a => a.date === todayStr);
    } else if (statusTab === 'Upcoming') {
      appointments = appointments.filter(a => a.date > todayStr && a.status !== 'Cancelled');
    } else if (statusTab === 'Completed') {
      appointments = appointments.filter(a => a.status === 'Completed');
    } else if (statusTab === 'Cancelled') {
      appointments = appointments.filter(a => a.status === 'Cancelled');
    } else if (statusTab === 'Pending') {
      appointments = appointments.filter(a => a.status === 'Pending');
    }

    return appointments.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
  },

  async updateAppointmentStatus(appointmentId, status) {
    await delay(300);
    return updateStoredAppointment(appointmentId, { status });
  },

  async saveDiagnosisAndRecommendations(appointmentId, { diagnosis, recommendations }) {
    await delay(400);
    return saveStoredDiagnosis(appointmentId, diagnosis.trim(), recommendations.trim());
  },

  // PATIENT API ENDPOINTS
  async getPatientProfile(patientId) {
    await delay(250);
    const patients = getStoredPatients();
    const patient = patients.find(p => p.id === patientId || p.userId === patientId);
    if (!patient) return patients[0];
    return patient;
  },

  async updatePatientProfile(patientId, profileData) {
    await delay(350);
    if (!profileData.fullName || !profileData.email || !profileData.phone) {
      throw new Error('Full Name, Email, and Phone are required.');
    }
    return updateStoredPatient(patientId, profileData);
  },

  async getPatientDashboardStats(patientId) {
    await delay(300);
    const appointments = getStoredAppointments().filter(a => a.patientId === patientId);
    const todayStr = new Date().toISOString().split('T')[0];

    const upcoming = appointments.filter(a => a.date >= todayStr && a.status !== 'Cancelled' && a.status !== 'Completed');
    const completed = appointments.filter(a => a.status === 'Completed');
    const cancelled = appointments.filter(a => a.status === 'Cancelled');

    // Next upcoming appointment
    const nextAppt = upcoming.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))[0] || null;

    return {
      totalAppointments: appointments.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      nextAppointment: nextAppt
    };
  },

  async getAllDoctors(search = '', department = 'All', specialization = 'All') {
    await delay(300);
    let doctors = getStoredDoctors();

    if (search.trim()) {
      const q = search.toLowerCase();
      doctors = doctors.filter(d =>
        d.fullName.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q)
      );
    }

    if (department !== 'All') {
      doctors = doctors.filter(d => d.department.toLowerCase() === department.toLowerCase());
    }

    if (specialization !== 'All') {
      doctors = doctors.filter(d => d.specialization.toLowerCase() === specialization.toLowerCase());
    }

    return doctors;
  },

  async getDoctorDetails(doctorId) {
    await delay(250);
    const doctors = getStoredDoctors();
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) throw new Error('Doctor not found');
    return doctor;
  },

  async getDoctorAvailableSlots(doctorId, date) {
    await delay(250);
    return getAvailableSlotsForDoctor(doctorId, date);
  },

  async bookAppointment(bookingData) {
    await delay(450);
    if (!bookingData.doctorId) throw new Error('Please select a doctor.');
    if (!bookingData.patientId) throw new Error('Authentication required to book appointment.');
    if (!bookingData.date) throw new Error('Please select an appointment date.');
    if (!bookingData.time) throw new Error('Please select an available time slot.');
    if (!bookingData.reason || !bookingData.reason.trim()) throw new Error('Please provide a reason for your visit.');

    return createStoredAppointment(bookingData);
  },

  async getPatientAppointments(patientId, statusFilter = 'All') {
    await delay(300);
    let appointments = getStoredAppointments().filter(a => a.patientId === patientId);

    if (statusFilter !== 'All') {
      appointments = appointments.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
    }

    return appointments.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
  },

  async cancelAppointment(appointmentId, patientId) {
    await delay(350);
    return cancelStoredAppointment(appointmentId, patientId);
  }
};

// API Client Service for Doctor Panel
// Provides asynchronous API methods simulating network requests with real backend store persistence

import {
  getStoredDoctors,
  getStoredPatients,
  getStoredAppointments,
  updateStoredDoctor,
  updateStoredAppointment,
  saveStoredDiagnosis,
  getCurrentUser,
  setCurrentUser
} from './backendStore.js';

// Simulated delay helper
const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Authentication
  async login(email, password) {
    await delay(500);
    const doctors = getStoredDoctors();
    const doctor = doctors.find(d => d.email.toLowerCase() === email.toLowerCase());

    if (!doctor && email !== 'doctor@hospital.org') {
      throw new Error('Invalid email or password. Please try doctor@hospital.org');
    }

    const userDoctor = doctor || doctors[0];
    const user = {
      id: userDoctor.userId || 'user-doc-1',
      doctorId: userDoctor.id,
      name: userDoctor.fullName,
      email: userDoctor.email,
      role: 'doctor',
      token: `jwt_token_${userDoctor.id}_${Date.now()}`
    };

    setCurrentUser(user);
    return user;
  },

  async getCurrentDoctorProfile(doctorId) {
    await delay(300);
    const doctors = getStoredDoctors();
    const doctor = doctors.find(d => d.id === doctorId || d.userId === doctorId);
    if (!doctor) {
      // Fallback to first doctor
      return doctors[0];
    }
    return doctor;
  },

  async updateDoctorProfile(doctorId, profileData) {
    await delay(450);
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
    await delay(350);
    let patients = getStoredPatients().filter(p => p.doctorId === doctorId);
    const appointments = getStoredAppointments().filter(a => a.doctorId === doctorId);

    // Attach latest appointment to patient object
    patients = patients.map(patient => {
      const pAppointments = appointments.filter(a => a.patientId === patient.id);
      const latestAppt = pAppointments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      return {
        ...patient,
        latestAppointmentDate: latestAppt ? `${latestAppt.date} (${latestAppt.time})` : 'N/A',
        appointmentStatus: latestAppt ? latestAppt.status : 'Active'
      };
    });

    // Apply Search
    if (search.trim()) {
      const q = search.toLowerCase();
      patients = patients.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }

    // Apply Gender Filter
    if (genderFilter !== 'All') {
      patients = patients.filter(p => p.gender.toLowerCase() === genderFilter.toLowerCase());
    }

    // Apply Status Filter
    if (statusFilter !== 'All') {
      patients = patients.filter(p => p.appointmentStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    return patients;
  },

  async getPatientDetails(patientId, doctorId) {
    await delay(300);
    const patients = getStoredPatients();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) {
      throw new Error('Patient record not found');
    }

    if (patient.doctorId !== doctorId) {
      throw new Error('Unauthorized: Patient belongs to another medical specialist.');
    }

    const appointments = getStoredAppointments().filter(a => a.patientId === patientId);
    return {
      ...patient,
      appointmentHistory: appointments
    };
  },

  async getDoctorAppointments(doctorId, statusTab = 'All') {
    await delay(350);
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

    // Sort by date & time
    return appointments.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
  },

  async updateAppointmentStatus(appointmentId, status) {
    await delay(350);
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return updateStoredAppointment(appointmentId, { status });
  },

  async saveDiagnosisAndRecommendations(appointmentId, { diagnosis, recommendations }) {
    await delay(450);
    if (!diagnosis || !diagnosis.trim()) {
      throw new Error('Diagnosis cannot be empty.');
    }
    if (!recommendations || !recommendations.trim()) {
      throw new Error('Recommendations and treatment notes cannot be empty.');
    }
    return saveStoredDiagnosis(appointmentId, diagnosis.trim(), recommendations.trim());
  }
};

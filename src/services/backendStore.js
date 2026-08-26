// Backend Persistent Store for Hospital Management System
// Simulates a backend database with local persistence and API latency simulation

const STORAGE_KEYS = {
  USERS: 'hms_users',
  DOCTORS: 'hms_doctors',
  PATIENTS: 'hms_patients',
  APPOINTMENTS: 'hms_appointments',
  DIAGNOSES: 'hms_diagnoses',
  CURRENT_USER: 'hms_current_user',
  AUTH_TOKEN: 'hms_auth_token'
};

const INITIAL_DOCTORS = [
  {
    id: 'doc-101',
    userId: 'user-doc-1',
    fullName: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@hospital.org',
    phone: '+1 (555) 234-5678',
    specialization: 'Cardiology',
    department: 'Cardiovascular Care',
    experience: '12 Years',
    biography: 'Board-certified cardiologist specializing in preventive cardiology, coronary artery disease management, and cardiac rehabilitation. Dedicated to providing compassionate, evidence-based patient care.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '08:30 AM - 04:30 PM',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    rating: 4.9,
    roomNo: 'Cabinet 304, North Wing'
  },
  {
    id: 'doc-102',
    userId: 'user-doc-2',
    fullName: 'Dr. Marcus Vance',
    email: 'marcus.vance@hospital.org',
    phone: '+1 (555) 876-5432',
    specialization: 'Neurology',
    department: 'Neurosciences',
    experience: '15 Years',
    biography: 'Expert in clinical neurology focusing on movement disorders, migraines, and neuromuscular diseases.',
    workingDays: ['Monday', 'Wednesday', 'Friday'],
    workingHours: '09:00 AM - 05:00 PM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    rating: 4.8,
    roomNo: 'Cabinet 210, West Wing'
  }
];

const INITIAL_PATIENTS = [
  {
    id: 'pat-201',
    doctorId: 'doc-101',
    fullName: 'Eleanor Vance',
    age: 42,
    gender: 'Female',
    phone: '+1 (555) 112-3344',
    email: 'eleanor.vance@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: 'Robert Vance (Husband) - +1 (555) 998-1122',
    medicalHistory: [
      {
        id: 'diag-1',
        date: '2026-06-15',
        doctorName: 'Dr. Sarah Jenkins',
        diagnosis: 'Mild Essential Hypertension',
        notes: 'Patient presented with intermittent headaches and systolic BP consistently around 142/88 mmHg.',
        recommendations: 'Prescribed Amlodipine 5mg daily. Advised low-sodium dash diet and 30 mins walking daily. Recheck in 4 weeks.',
        prescriptions: ['Amlodipine 5mg - 1 tablet daily in the morning', 'Omega-3 Fish Oil 1000mg - 1 tablet daily']
      },
      {
        id: 'diag-2',
        date: '2026-03-10',
        doctorName: 'Dr. Sarah Jenkins',
        diagnosis: 'Sinus Tachycardia due to stress',
        notes: 'ECG showed regular sinus rhythm at 104 bpm. Normal cardiac enzyme levels.',
        recommendations: 'Stress reduction technique, reduced caffeine intake.',
        prescriptions: []
      }
    ]
  },
  {
    id: 'pat-202',
    doctorId: 'doc-101',
    fullName: 'James Reynolds',
    age: 58,
    gender: 'Male',
    phone: '+1 (555) 443-2211',
    email: 'j.reynolds@techmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'O+',
    allergies: ['None'],
    emergencyContact: 'Clara Reynolds (Wife) - +1 (555) 887-3322',
    medicalHistory: [
      {
        id: 'diag-3',
        date: '2026-07-20',
        doctorName: 'Dr. Sarah Jenkins',
        diagnosis: 'Post-CABG Routine Follow-up',
        notes: 'Surgical wound healed cleanly. Blood pressure 125/78, Resting HR 68. Patient reports improved stamina.',
        recommendations: 'Continue cardiac rehab program 3x weekly. Statins to be continued.',
        prescriptions: ['Atorvastatin 40mg - 1 tablet at night', 'Aspirin 81mg - 1 tablet daily']
      }
    ]
  },
  {
    id: 'pat-203',
    doctorId: 'doc-101',
    fullName: 'Sophia Martinez',
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 667-8899',
    email: 'sophia.m@designstudio.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'B+',
    allergies: ['Sulfa Drugs'],
    emergencyContact: 'Carlos Martinez (Father) - +1 (555) 334-5566',
    medicalHistory: [
      {
        id: 'diag-4',
        date: '2026-08-01',
        doctorName: 'Dr. Sarah Jenkins',
        diagnosis: 'Palpitations & Mitral Valve Click',
        notes: 'Echocardiogram indicated minor benign MVP with mild mitral regurgitation.',
        recommendations: 'Avoid heavy stimulants and energy drinks. Hydration maintenance.',
        prescriptions: ['Magnesium supplement 400mg daily']
      }
    ]
  },
  {
    id: 'pat-204',
    doctorId: 'doc-101',
    fullName: 'David Kim',
    age: 64,
    gender: 'Male',
    phone: '+1 (555) 778-9900',
    email: 'dkim.architect@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'AB-',
    allergies: ['Iodine Contrast'],
    emergencyContact: 'Grace Kim (Daughter) - +1 (555) 445-6677',
    medicalHistory: []
  },
  {
    id: 'pat-205',
    doctorId: 'doc-101',
    fullName: 'Amara Okafor',
    age: 35,
    gender: 'Female',
    phone: '+1 (555) 223-9988',
    email: 'amara.okafor@global.net',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'O-',
    allergies: ['Latex'],
    emergencyContact: 'Ken Okafor (Brother) - +1 (555) 112-9900',
    medicalHistory: []
  }
];

const TODAY_STR = new Date().toISOString().split('T')[0];
const YESTERDAY_STR = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const TOMORROW_STR = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const IN_3_DAYS_STR = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-301',
    doctorId: 'doc-101',
    patientId: 'pat-201',
    patientName: 'Eleanor Vance',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    date: TODAY_STR,
    time: '09:30 AM',
    type: 'Follow-up Consultation',
    reason: 'BP Re-check and medication tolerance monitoring.',
    status: 'Pending',
    diagnosis: '',
    recommendations: ''
  },
  {
    id: 'apt-302',
    doctorId: 'doc-101',
    patientId: 'pat-202',
    patientName: 'James Reynolds',
    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    date: TODAY_STR,
    time: '11:00 AM',
    type: 'Post-Op Review',
    reason: 'Monthly checkup following coronary artery bypass graft surgery.',
    status: 'Confirmed',
    diagnosis: '',
    recommendations: ''
  },
  {
    id: 'apt-303',
    doctorId: 'doc-101',
    patientId: 'pat-203',
    patientName: 'Sophia Martinez',
    patientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    date: TODAY_STR,
    time: '02:15 PM',
    type: 'Routine ECG Review',
    reason: 'Reviewing Holter monitor report from last week.',
    status: 'Completed',
    diagnosis: 'Benign Premature Ventricular Contractions (PVCs)',
    recommendations: 'No antiarrhythmic medication indicated currently. Continue lifestyle modification, adequate electrolyte balance, and reduce caffeine intake. Follow-up ECG in 6 months.'
  },
  {
    id: 'apt-304',
    doctorId: 'doc-101',
    patientId: 'pat-204',
    patientName: 'David Kim',
    patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    date: TOMORROW_STR,
    time: '10:00 AM',
    type: 'Initial Consultation',
    reason: 'Referred by primary physician for exertional chest tightness.',
    status: 'Confirmed',
    diagnosis: '',
    recommendations: ''
  },
  {
    id: 'apt-305',
    doctorId: 'doc-101',
    patientId: 'pat-205',
    patientName: 'Amara Okafor',
    patientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    date: IN_3_DAYS_STR,
    time: '03:30 PM',
    type: 'Echocardiogram Follow-up',
    reason: 'Evaluate structural heart condition and valve function.',
    status: 'Pending',
    diagnosis: '',
    recommendations: ''
  },
  {
    id: 'apt-306',
    doctorId: 'doc-101',
    patientId: 'pat-201',
    patientName: 'Eleanor Vance',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    date: YESTERDAY_STR,
    time: '04:00 PM',
    type: 'Urgent Consultation',
    reason: 'Dizziness after morning dosage.',
    status: 'Cancelled',
    diagnosis: '',
    recommendations: ''
  }
];

// Helper to seed localStorage
export function initializeBackendStore() {
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default logged in doctor user
    const defaultUser = {
      id: 'user-doc-1',
      doctorId: 'doc-101',
      name: 'Dr. Sarah Jenkins',
      email: 'sarah.jenkins@hospital.org',
      role: 'doctor',
      token: 'jwt_mock_token_doctor_sarah_jenkins_2026'
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
  }
}

// Data access utilities
export function getStoredDoctors() {
  initializeBackendStore();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCTORS) || '[]');
}

export function getStoredPatients() {
  initializeBackendStore();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
}

export function getStoredAppointments() {
  initializeBackendStore();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
}

export function getCurrentUser() {
  initializeBackendStore();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function updateStoredDoctor(doctorId, updatedFields) {
  const doctors = getStoredDoctors();
  const index = doctors.findIndex(d => d.id === doctorId);
  if (index !== -1) {
    doctors[index] = { ...doctors[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    return doctors[index];
  }
  throw new Error('Doctor not found');
}

export function updateStoredAppointment(appointmentId, updatedFields) {
  const appointments = getStoredAppointments();
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return appointments[index];
  }
  throw new Error('Appointment not found');
}

export function saveStoredDiagnosis(appointmentId, diagnosis, recommendations) {
  const appointments = getStoredAppointments();
  const apptIndex = appointments.findIndex(a => a.id === appointmentId);
  if (apptIndex === -1) throw new Error('Appointment not found');

  const appt = appointments[apptIndex];
  appt.diagnosis = diagnosis;
  appt.recommendations = recommendations;
  appt.status = 'Completed'; // Automatically mark completed when diagnosis saved

  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

  // Also add to patient medical history record
  const patients = getStoredPatients();
  const patientIndex = patients.findIndex(p => p.id === appt.patientId);
  if (patientIndex !== -1) {
    const patient = patients[patientIndex];
    if (!patient.medicalHistory) patient.medicalHistory = [];
    
    // Check if entry for this date/diagnosis exists, or append new entry
    const newRecord = {
      id: `diag-${Date.now()}`,
      date: appt.date || new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Sarah Jenkins',
      diagnosis: diagnosis,
      notes: `Appointment Type: ${appt.type}. Reason: ${appt.reason}`,
      recommendations: recommendations,
      prescriptions: recommendations.split('\n').filter(line => line.trim().length > 0)
    };

    patient.medicalHistory.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }

  return appt;
}

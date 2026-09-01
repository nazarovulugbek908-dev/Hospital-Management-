// Backend Persistent Store for Hospital Management System
// Simulates a backend database with local persistence and API latency simulation for both Doctor & Patient panels

const STORAGE_KEYS = {
  USERS: 'hms_users',
  DOCTORS: 'hms_doctors',
  PATIENTS: 'hms_patients',
  APPOINTMENTS: 'hms_appointments',
  DIAGNOSES: 'hms_diagnoses',
  CURRENT_USER: 'hms_current_user',
  AUTH_TOKEN: 'hms_auth_token'
};

const STANDARD_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM'
];

const INITIAL_DOCTORS = [
  {
    id: 'doc-101',
    userId: 'user-doc-1',
    fullName: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@hospital.org',
    phone: '+998 (90) 234-56-78',
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
    phone: '+998 (91) 876-54-32',
    specialization: 'Neurology',
    department: 'Neurosciences',
    experience: '15 Years',
    biography: 'Expert in clinical neurology focusing on movement disorders, migraines, stroke prevention, and neuromuscular diseases.',
    workingDays: ['Monday', 'Wednesday', 'Friday'],
    workingHours: '09:00 AM - 05:00 PM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    rating: 4.8,
    roomNo: 'Cabinet 210, West Wing'
  },
  {
    id: 'doc-103',
    userId: 'user-doc-3',
    fullName: 'Dr. Elena Rostova',
    email: 'elena.rostova@hospital.org',
    phone: '+998 (93) 345-67-89',
    specialization: 'Pediatrics',
    department: 'Pediatric & Adolescent Medicine',
    experience: '9 Years',
    biography: 'Compassionate pediatrician devoted to child growth development, immunizations, and pediatric wellness care.',
    workingDays: ['Tuesday', 'Thursday', 'Saturday'],
    workingHours: '09:00 AM - 03:00 PM',
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&q=80&w=300',
    rating: 4.95,
    roomNo: 'Cabinet 105, East Wing'
  },
  {
    id: 'doc-104',
    userId: 'user-doc-4',
    fullName: 'Dr. Robert Thorne',
    email: 'robert.thorne@hospital.org',
    phone: '+998 (97) 901-23-45',
    specialization: 'Orthopedics',
    department: 'Orthopedic Surgery & Sports Medicine',
    experience: '18 Years',
    biography: 'Senior orthopedic surgeon specializing in joint replacement, sports injury rehabilitation, and arthroscopic surgery.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    workingHours: '08:00 AM - 04:00 PM',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    rating: 4.85,
    roomNo: 'Cabinet 412, South Wing'
  }
];

const INITIAL_PATIENTS = [
  {
    id: 'pat-201',
    userId: 'user-pat-1',
    fullName: 'Eleanor Vance',
    age: 42,
    dateOfBirth: '1984-05-12',
    gender: 'Female',
    phone: '+998 (90) 112-33-44',
    email: 'eleanor.vance@gmail.com',
    address: 'Toshkent sh., Yunusobod tumani',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: 'Robert Vance (Turmush o‘rtog‘i) - +998 (90) 998-11-22',
    doctorId: 'doc-101',
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
    userId: 'user-pat-2',
    fullName: 'James Reynolds',
    age: 58,
    dateOfBirth: '1968-11-24',
    gender: 'Male',
    phone: '+998 (91) 443-22-11',
    email: 'j.reynolds@techmail.com',
    address: 'Toshkent sh., Mirzo Ulug‘bek tumani',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'O+',
    allergies: ['None'],
    emergencyContact: 'Clara Reynolds (Turmush o‘rtog‘i) - +998 (91) 887-33-22',
    doctorId: 'doc-101',
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
    userId: 'user-pat-3',
    fullName: 'Sophia Martinez',
    age: 29,
    dateOfBirth: '1997-02-18',
    gender: 'Female',
    phone: '+998 (94) 667-88-99',
    email: 'sophia.m@designstudio.io',
    address: 'Toshkent sh., Chilonzor tumani',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    bloodGroup: 'B+',
    allergies: ['Sulfa Drugs'],
    emergencyContact: 'Carlos Martinez (Otasi) - +998 (94) 334-55-66',
    doctorId: 'doc-101',
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
    doctorName: 'Dr. Sarah Jenkins',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    doctorSpecialization: 'Cardiology',
    department: 'Cardiovascular Care',
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
    doctorName: 'Dr. Sarah Jenkins',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    doctorSpecialization: 'Cardiology',
    department: 'Cardiovascular Care',
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
    doctorName: 'Dr. Sarah Jenkins',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    doctorSpecialization: 'Cardiology',
    department: 'Cardiovascular Care',
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
    doctorId: 'doc-102',
    doctorName: 'Dr. Marcus Vance',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    doctorSpecialization: 'Neurology',
    department: 'Neurosciences',
    patientId: 'pat-201',
    patientName: 'Eleanor Vance',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    date: TOMORROW_STR,
    time: '10:00 AM',
    type: 'Initial Consultation',
    reason: 'Consultation for tension headaches and neck stiffness.',
    status: 'Confirmed',
    diagnosis: '',
    recommendations: ''
  },
  {
    id: 'apt-305',
    doctorId: 'doc-103',
    doctorName: 'Dr. Elena Rostova',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&q=80&w=300',
    doctorSpecialization: 'Pediatrics',
    department: 'Pediatric & Adolescent Medicine',
    patientId: 'pat-201',
    patientName: 'Eleanor Vance',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    date: IN_3_DAYS_STR,
    time: '03:30 PM',
    type: 'Family Wellness Consultation',
    reason: 'Discussion regarding pediatric allergy prevention strategies.',
    status: 'Pending',
    diagnosis: '',
    recommendations: ''
  }
];

// Seed Helper
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
    // Default logged in user (Patient role default, can switch to Doctor)
    const defaultUser = {
      id: 'user-pat-1',
      patientId: 'pat-201',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@gmail.com',
      role: 'patient',
      token: 'jwt_mock_token_patient_eleanor_vance_2026'
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
  }
}

// Data Accessors
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

// Mutators & Slot Checkers
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

export function updateStoredPatient(patientId, updatedFields) {
  const patients = getStoredPatients();
  const index = patients.findIndex(p => p.id === patientId);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return patients[index];
  }
  throw new Error('Patient not found');
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

export function cancelStoredAppointment(appointmentId, patientId) {
  const appointments = getStoredAppointments();
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index === -1) throw new Error('Appointment not found');

  const appt = appointments[index];
  if (appt.patientId !== patientId) {
    throw new Error('Unauthorized: You can only cancel your own appointments.');
  }

  appt.status = 'Cancelled';
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  return appt;
}

export function getAvailableSlotsForDoctor(doctorId, date) {
  const appointments = getStoredAppointments();
  // Filter active appointments for doctor on date (excluding cancelled)
  const bookedSlots = appointments
    .filter(a => a.doctorId === doctorId && a.date === date && a.status !== 'Cancelled')
    .map(a => a.time);

  return STANDARD_SLOTS.map(time => ({
    time,
    isAvailable: !bookedSlots.includes(time)
  }));
}

export function createStoredAppointment(data) {
  const { doctorId, patientId, date, time, reason, type = 'General Consultation' } = data;

  const doctors = getStoredDoctors();
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) throw new Error('Selected doctor does not exist.');

  const patients = getStoredPatients();
  const patient = patients.find(p => p.id === patientId);
  if (!patient) throw new Error('Patient record not found.');

  // Check double booking
  const existingAppts = getStoredAppointments();
  const isAlreadyBooked = existingAppts.some(
    a => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'Cancelled'
  );

  if (isAlreadyBooked) {
    throw new Error(`The time slot ${time} on ${date} is already booked for ${doctor.fullName}. Please choose another time.`);
  }

  const newAppt = {
    id: `apt-${Date.now()}`,
    doctorId: doctor.id,
    doctorName: doctor.fullName,
    doctorAvatar: doctor.avatar,
    doctorSpecialization: doctor.specialization,
    department: doctor.department,
    patientId: patient.id,
    patientName: patient.fullName,
    patientAvatar: patient.avatar,
    date,
    time,
    type,
    reason,
    status: 'Pending',
    diagnosis: '',
    recommendations: ''
  };

  existingAppts.unshift(newAppt);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(existingAppts));
  return newAppt;
}

export function saveStoredDiagnosis(appointmentId, diagnosis, recommendations) {
  const appointments = getStoredAppointments();
  const apptIndex = appointments.findIndex(a => a.id === appointmentId);
  if (apptIndex === -1) throw new Error('Appointment not found');

  const appt = appointments[apptIndex];
  appt.diagnosis = diagnosis;
  appt.recommendations = recommendations;
  appt.status = 'Completed';

  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

  const patients = getStoredPatients();
  const patientIndex = patients.findIndex(p => p.id === appt.patientId);
  if (patientIndex !== -1) {
    const patient = patients[patientIndex];
    if (!patient.medicalHistory) patient.medicalHistory = [];
    
    const newRecord = {
      id: `diag-${Date.now()}`,
      date: appt.date || new Date().toISOString().split('T')[0],
      doctorName: appt.doctorName || 'Dr. Sarah Jenkins',
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

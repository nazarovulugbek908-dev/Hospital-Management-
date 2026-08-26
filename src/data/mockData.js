export const initialDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. John Smith',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    email: 'john.smith@medicare.org',
    phone: '+1 (555) 234-5678',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    experience: '8 years experience',
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 128,
    availability: 'Available Today',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '09:00 AM - 05:00 PM',
    languages: ['English', 'Spanish'],
    fee: '$120',
    education: 'MD, Harvard Medical School • Fellow of the American College of Cardiology',
    biography: 'Dr. John Smith is an acclaimed cardiologist specializing in preventive cardiology, cardiovascular imaging, lipid management, and non-invasive diagnostic evaluations with over 8 years of clinical excellence.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1594824813682-be4fb6d43e5e?w=300&auto=format&fit=crop&q=80',
    email: 'sarah.johnson@medicare.org',
    phone: '+1 (555) 345-6789',
    department: 'Neurology',
    specialization: 'Neurologist',
    experience: '7 years experience',
    experienceYears: 7,
    rating: 4.95,
    reviewsCount: 156,
    availability: 'Available Today',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    workingHours: '08:30 AM - 04:30 PM',
    languages: ['English', 'French'],
    fee: '$150',
    education: 'MD, Stanford University School of Medicine • Chief Resident in Clinical Neurology',
    biography: 'Dr. Sarah Johnson leads patient-centered neurological therapy, focusing on chronic headache management, neuromuscular health, and comprehensive brain health assessments.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    email: 'michael.brown@medicare.org',
    phone: '+1 (555) 456-7890',
    department: 'Pediatrics',
    specialization: 'Pediatrician',
    experience: '10 years experience',
    experienceYears: 10,
    rating: 4.88,
    reviewsCount: 112,
    availability: 'Available Tomorrow',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '09:00 AM - 03:30 PM',
    languages: ['English', 'German'],
    fee: '$95',
    education: 'MD, Columbia University Vagelos College of Physicians and Surgeons',
    biography: 'Dr. Michael Brown brings a decade of dedicated pediatric care, specializing in childhood wellness checks, developmental screening, immunization schedules, and adolescent counseling.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    email: 'emily.davis@medicare.org',
    phone: '+1 (555) 567-8901',
    department: 'Orthopedics',
    specialization: 'Orthopedic Specialist',
    experience: '6 years experience',
    experienceYears: 6,
    rating: 4.92,
    reviewsCount: 94,
    availability: 'Available Today',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    workingHours: '10:00 AM - 06:00 PM',
    languages: ['English', 'Mandarin'],
    fee: '$135',
    education: 'MD, University of Pennsylvania Perelman School of Medicine',
    biography: 'Dr. Emily Davis provides specialized musculoskeletal care, sports injury rehabilitation, joint therapy, and post-injury mobility recovery protocols.'
  },
  {
    id: 'doc-5',
    name: 'Dr. Robert Wilson',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    email: 'robert.wilson@medicare.org',
    phone: '+1 (555) 678-9012',
    department: 'Dermatology',
    specialization: 'Dermatologist',
    experience: '9 years experience',
    experienceYears: 9,
    rating: 4.85,
    reviewsCount: 89,
    availability: 'Available Today',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    workingHours: '09:30 AM - 05:00 PM',
    languages: ['English', 'Spanish'],
    fee: '$110',
    education: 'MD, Yale School of Medicine • Board Certified in Dermatology',
    biography: 'Dr. Robert Wilson offers cutting-edge therapeutic skin diagnostics, laser treatments, allergy consultations, and personalized dermatological therapies.'
  },
  {
    id: 'doc-6',
    name: 'Dr. Amanda Clark',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&auto=format&fit=crop&q=80',
    email: 'amanda.clark@medicare.org',
    phone: '+1 (555) 789-0123',
    department: 'General Medicine',
    specialization: 'General Practitioner',
    experience: '11 years experience',
    experienceYears: 11,
    rating: 4.94,
    reviewsCount: 165,
    availability: 'Available Today',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '08:00 AM - 04:00 PM',
    languages: ['English'],
    fee: '$90',
    education: 'MD, University of Michigan Medical School',
    biography: 'Dr. Amanda Clark provides comprehensive family primary care, routine annual checkups, chronic health monitoring, and wellness lifestyle counseling.'
  }
];

export const initialDemoPatient = {
  id: 'pat-101',
  name: 'John Williams',
  email: 'patient@hospital.com',
  password: 'patient123',
  phone: '+1 (555) 890-1234',
  dateOfBirth: '1988-05-14',
  gender: 'Male',
  bloodGroup: 'O+',
  address: '742 Evergreen Terrace, Springfield, OR',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  emergencyContact: 'Sarah Williams (Wife) - +1 (555) 890-5678',
  bio: 'Patient prioritizing preventative cardiology checkups and active fitness lifestyle.'
};

export const initialAppointments = [
  {
    id: 'apt-101',
    doctorName: 'Dr. John Smith',
    doctorId: 'doc-1',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    date: 'August 28, 2026',
    time: '10:30 AM',
    status: 'Confirmed', // Confirmed, Pending, Completed, Cancelled
    bookingDate: 'August 24, 2026',
    reason: 'Quarterly cardiovascular stress test and blood pressure monitoring review.',
    symptoms: 'Mild palpitations after high-intensity interval training.'
  },
  {
    id: 'apt-102',
    doctorName: 'Dr. Sarah Johnson',
    doctorId: 'doc-2',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813682-be4fb6d43e5e?w=300&auto=format&fit=crop&q=80',
    department: 'Neurology',
    specialization: 'Neurologist',
    date: 'September 04, 2026',
    time: '02:00 PM',
    status: 'Pending',
    bookingDate: 'August 25, 2026',
    reason: 'Follow-up consultation for screen-induced tension headaches.',
    symptoms: 'Occasional bilateral temple pressure after prolonged laptop use.'
  },
  {
    id: 'apt-103',
    doctorName: 'Dr. Amanda Clark',
    doctorId: 'doc-6',
    doctorAvatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&auto=format&fit=crop&q=80',
    department: 'General Medicine',
    specialization: 'General Practitioner',
    date: 'September 12, 2026',
    time: '11:00 AM',
    status: 'Confirmed',
    bookingDate: 'August 26, 2026',
    reason: 'Annual routine health checkup and lipid panel prescription refill.',
    symptoms: 'Routine annual review.'
  },
  {
    id: 'apt-104',
    doctorName: 'Dr. Emily Davis',
    doctorId: 'doc-4',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    department: 'Orthopedics',
    specialization: 'Orthopedic Specialist',
    date: 'August 14, 2026',
    time: '09:00 AM',
    status: 'Completed',
    bookingDate: 'August 02, 2026',
    reason: 'Right knee mobility check and post-exercise recovery therapy evaluation.',
    symptoms: 'Mild knee stiffness resolved with prescribed stretches.'
  },
  {
    id: 'apt-105',
    doctorName: 'Dr. Robert Wilson',
    doctorId: 'doc-5',
    doctorAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    department: 'Dermatology',
    specialization: 'Dermatologist',
    date: 'July 28, 2026',
    time: '03:30 PM',
    status: 'Completed',
    bookingDate: 'July 15, 2026',
    reason: 'Annual preventive skin examination and allergy assessment.',
    symptoms: 'Mild dry skin patch on forearm.'
  },
  {
    id: 'apt-106',
    doctorName: 'Dr. Michael Brown',
    doctorId: 'doc-3',
    doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    department: 'Pediatrics',
    specialization: 'Pediatrician',
    date: 'July 10, 2026',
    time: '10:00 AM',
    status: 'Cancelled',
    bookingDate: 'July 01, 2026',
    reason: 'Schedule conflict, rescheduled to later date.',
    symptoms: 'N/A'
  }
];

export const initialMedicalRecords = [
  {
    id: 'rec-1',
    date: 'August 20, 2026',
    doctor: 'Dr. John Smith',
    department: 'Cardiology',
    diagnosis: 'Primary Stage 1 Essential Hypertension (Well Managed & Stable)',
    recommendations: 'Continue low-sodium DASH diet protocol, maintain 30 minutes of moderate aerobic cardio 4x weekly, and record morning resting blood pressure.',
    doctorNotes: 'Patient demonstrates optimal adherence to prescribed lifestyle changes. Resting heart rate 68 bpm, BP reading 118/78 mmHg. Schedule repeat ECG in 6 months.',
    vitals: {
      bp: '118/78 mmHg',
      heartRate: '68 bpm',
      glucose: '94 mg/dL',
      bmi: '23.6'
    }
  },
  {
    id: 'rec-2',
    date: 'August 14, 2026',
    doctor: 'Dr. Emily Davis',
    department: 'Orthopedics',
    diagnosis: 'Mild Patellar Tendon Strain (Post-Recovery Stage)',
    recommendations: 'Perform quadriceps and hamstring dynamic stretching routines before running. Avoid high-impact uphill sprints for 3 weeks.',
    doctorNotes: 'Full range of knee joint motion restored. No swelling or joint effusion observed. Physical therapy exercises cleared for normal recreational sports.',
    vitals: {
      bp: '120/80 mmHg',
      heartRate: '72 bpm',
      glucose: '92 mg/dL',
      bmi: '23.6'
    }
  },
  {
    id: 'rec-3',
    date: 'July 28, 2026',
    doctor: 'Dr. Robert Wilson',
    department: 'Dermatology',
    diagnosis: 'Mild Contact Dermatitis / Seasonal Xerosis',
    recommendations: 'Apply ceramide moisturizing cream twice daily after showering. Use SPF 50 mineral sunscreen during prolonged outdoor exposure.',
    doctorNotes: 'Epidermal barrier intact. No signs of atypical melanocytic lesions. Recommended gentle fragrance-free body wash.',
    vitals: {
      bp: '116/76 mmHg',
      heartRate: '70 bpm',
      glucose: '90 mg/dL',
      bmi: '23.6'
    }
  }
];

export const initialTasks = [
  {
    id: 'task-1',
    title: 'Confirm appointment with Dr. John Smith',
    description: 'Review recent blood pressure logs and take morning medication before 10:30 AM visit.',
    priority: 'High',
    dueDate: '2026-08-28',
    category: 'Appointment',
    status: 'In Progress'
  },
  {
    id: 'task-2',
    title: 'Order prescription refill (Lisinopril 10mg)',
    description: 'Request delivery via MediCare online pharmacy portal or local pickup.',
    priority: 'High',
    dueDate: '2026-08-29',
    category: 'Personal',
    status: 'Todo'
  },
  {
    id: 'task-3',
    title: 'Complete 30-minute cardio exercise',
    description: 'Brisk evening walk or stationary cycling session per cardiology wellness plan.',
    priority: 'Medium',
    dueDate: '2026-08-28',
    category: 'Personal',
    status: 'Completed'
  },
  {
    id: 'task-4',
    title: 'Prepare questions for Dr. Sarah Johnson',
    description: 'Note down frequency of screen headaches and average daily screen time hours.',
    priority: 'Medium',
    dueDate: '2026-09-03',
    category: 'Appointment',
    status: 'Todo'
  },
  {
    id: 'task-5',
    title: 'Read cardiovascular wellness article',
    description: 'Review MediCare preventative health guide on heart rate zone training.',
    priority: 'Low',
    dueDate: '2026-09-05',
    category: 'Study',
    status: 'Todo'
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. John Smith has been confirmed for August 28, 2026 at 10:30 AM.',
    type: 'success',
    read: false,
    timestamp: '15 minutes ago',
    date: '2026-08-26'
  },
  {
    id: 'notif-2',
    title: 'Appointment Reminder',
    message: 'Your appointment is tomorrow at 10:30 AM. Please arrive 10 minutes early.',
    type: 'info',
    read: false,
    timestamp: '2 hours ago',
    date: '2026-08-26'
  },
  {
    id: 'notif-3',
    title: 'Medical Record Updated',
    message: 'Dr. John Smith uploaded summary diagnosis and recommendations to your profile.',
    type: 'info',
    read: true,
    timestamp: '2 days ago',
    date: '2026-08-24'
  },
  {
    id: 'notif-4',
    title: 'Appointment Cancelled',
    message: 'Your appointment with Dr. Michael Brown has been cancelled as requested.',
    type: 'warning',
    read: true,
    timestamp: '1 week ago',
    date: '2026-08-19'
  }
];

export const timeSlots = [
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
  '04:00 PM',
  '04:30 PM'
];

export const departmentsList = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine'
];

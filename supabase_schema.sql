-- =======================================================
-- MEDICARE HOSPITAL MANAGEMENT SYSTEM - SUPABASE SCHEMA
-- Project URL: https://ruwsodepugidsqsihtkx.supabase.co
-- Run this complete script in Supabase Dashboard > SQL Editor
-- =======================================================

-- 1. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT NOT NULL DEFAULT 'General Medicine',
  specialization TEXT NOT NULL DEFAULT 'Attending Physician',
  experience TEXT DEFAULT '5+ years experience',
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  availability TEXT DEFAULT 'Available Today',
  available_days TEXT[] DEFAULT ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday'],
  working_hours TEXT DEFAULT '09:00 AM - 05:00 PM',
  languages TEXT[] DEFAULT ARRAY['English','Uzbek'],
  fee TEXT DEFAULT '$100',
  education TEXT DEFAULT 'MD, Medical School Graduate',
  biography TEXT DEFAULT 'Medical healthcare specialist at MediCare Hospital.',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure updated_at column exists if table was created previously
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='doctors' AND column_name='updated_at') THEN
    ALTER TABLE public.doctors ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access for doctors" ON public.doctors;
CREATE POLICY "Allow public access for doctors" ON public.doctors
  FOR ALL USING (true) WITH CHECK (true);


-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth TEXT,
  gender TEXT DEFAULT 'Male',
  blood_group TEXT DEFAULT 'A+',
  address TEXT,
  avatar TEXT,
  emergency_contact TEXT,
  medical_condition TEXT,
  status TEXT DEFAULT 'Active',
  registered_date TEXT,
  bio TEXT,
  role TEXT DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access for patients" ON public.patients;
CREATE POLICY "Allow public access for patients" ON public.patients
  FOR ALL USING (true) WITH CHECK (true);


-- 3. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  doctor_id TEXT,
  doctor_name TEXT NOT NULL,
  doctor_avatar TEXT,
  department TEXT,
  specialization TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  reason TEXT,
  symptoms TEXT,
  status TEXT DEFAULT 'Pending',
  booking_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access for appointments" ON public.appointments;
CREATE POLICY "Allow public access for appointments" ON public.appointments
  FOR ALL USING (true) WITH CHECK (true);


-- 4. TODOS (TASKS) TABLE
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'Medium',
  category TEXT DEFAULT 'Personal',
  status TEXT DEFAULT 'Todo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access for todos" ON public.todos;
CREATE POLICY "Allow public access for todos" ON public.todos
  FOR ALL USING (true) WITH CHECK (true);


-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  timestamp TEXT DEFAULT 'Just now',
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access for notifications" ON public.notifications;
CREATE POLICY "Allow public access for notifications" ON public.notifications
  FOR ALL USING (true) WITH CHECK (true);


-- 6. MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.medical_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  doctor TEXT NOT NULL,
  department TEXT,
  diagnosis TEXT NOT NULL,
  recommendations TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access for medical_records" ON public.medical_records;
CREATE POLICY "Allow public access for medical_records" ON public.medical_records
  FOR ALL USING (true) WITH CHECK (true);


-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON public.medical_records(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON public.doctors(department);
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);


-- 8. AUTO-UPDATE TIMESTAMP FUNCTION & TRIGGERS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_doctors_updated_at ON public.doctors;
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON public.patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 9. ENABLE SUPABASE REALTIME REPLICATION FOR ALL TABLES
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_records;

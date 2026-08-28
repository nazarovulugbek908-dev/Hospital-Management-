-- =======================================================
-- 🏥 MEDICARE HOSPITAL MANAGEMENT SYSTEM - SUPABASE SCHEMA
-- Copy and run this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ruwsodepugidsqsihtkx/sql
-- =======================================================

-- 1. Create Todos (Tasks) Table
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'Medium',
  category TEXT DEFAULT 'Personal',
  status TEXT DEFAULT 'Todo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Policies for Todos
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for todos" ON public.todos
  FOR ALL USING (true) WITH CHECK (true);


-- 2. Create Appointments Table
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Policies for Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for appointments" ON public.appointments
  FOR ALL USING (true) WITH CHECK (true);


-- 3. Create Notifications Table
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

-- Enable RLS & Policies for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for notifications" ON public.notifications
  FOR ALL USING (true) WITH CHECK (true);


-- 4. Create Medical Records Table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  doctor TEXT NOT NULL,
  department TEXT,
  diagnosis TEXT NOT NULL,
  recommendations TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Policies for Medical Records
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for medical_records" ON public.medical_records
  FOR ALL USING (true) WITH CHECK (true);


-- 5. Create Doctors Table (Optional Catalog)
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  specialization TEXT NOT NULL,
  avatar TEXT,
  rating NUMERIC DEFAULT 4.9,
  reviews_count INT DEFAULT 100,
  experience TEXT DEFAULT '10+ Years',
  education TEXT,
  biography TEXT,
  fee TEXT DEFAULT '$120',
  working_hours TEXT DEFAULT '09:00 AM - 05:00 PM',
  availability TEXT DEFAULT 'Available Today',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for doctors" ON public.doctors
  FOR ALL USING (true) WITH CHECK (true);

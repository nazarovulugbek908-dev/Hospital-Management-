-- ============================================
-- SUPABASE ADMIN PANEL TABLES
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- ============================================

-- 1. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  specialization TEXT,
  experience TEXT,
  experience_years INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'Available Today',
  available_days TEXT[] DEFAULT ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday'],
  working_hours TEXT DEFAULT '09:00 AM - 05:00 PM',
  languages TEXT[] DEFAULT ARRAY['English','Uzbek'],
  fee TEXT DEFAULT '$100',
  education TEXT,
  biography TEXT,
  avatar TEXT,
  gender TEXT DEFAULT 'Male',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
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

-- 3. Enable Row Level Security (RLS) but allow all for now
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for development - tighten for production)
CREATE POLICY "Allow all doctors operations" ON doctors
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all patients operations" ON patients
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

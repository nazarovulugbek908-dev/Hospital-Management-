import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Layout
import { PatientLayout } from '../layouts/PatientLayout.jsx';

// Public Pages
import { Home } from '../pages/Home.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Register } from '../pages/auth/Register.jsx';
import { ForgotPassword } from '../pages/auth/ForgotPassword.jsx';

// Patient Pages
import { Dashboard } from '../pages/patient/Dashboard.jsx';
import { Doctors } from '../pages/patient/Doctors.jsx';
import { DoctorProfile } from '../pages/patient/DoctorProfile.jsx';
import { BookAppointment } from '../pages/patient/BookAppointment.jsx';
import { Appointments } from '../pages/patient/Appointments.jsx';
import { AppointmentDetails } from '../pages/patient/AppointmentDetails.jsx';
import { MedicalRecords } from '../pages/patient/MedicalRecords.jsx';
import { Profile } from '../pages/patient/Profile.jsx';
import { Settings } from '../pages/patient/Settings.jsx';
import { Notifications } from '../pages/notifications/Notifications.jsx';
import { Todo } from '../pages/todo/Todo.jsx';
import { NotFound } from '../pages/NotFound.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] text-primary">
        <div className="animate-spin text-3xl">⏳</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Patient Portal Pages (Under PatientLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient/dashboard" element={<Dashboard />} />
        <Route path="/patient/doctors" element={<Doctors />} />
        <Route path="/patient/doctors/:id" element={<DoctorProfile />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<Appointments />} />
        <Route path="/patient/appointments/:id" element={<AppointmentDetails />} />
        <Route path="/patient/medical-records" element={<MedicalRecords />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/todo" element={<Todo />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

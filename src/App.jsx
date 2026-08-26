// Main Doctor Panel Application Component

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider, useToast } from './components/common/ToastContainer.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { DoctorDashboard } from './components/doctor/DoctorDashboard.jsx';
import { DoctorProfile } from './components/doctor/DoctorProfile.jsx';
import { PatientsList } from './components/doctor/PatientsList.jsx';
import { PatientDetailsModal } from './components/doctor/PatientDetailsModal.jsx';
import { AppointmentsList } from './components/doctor/AppointmentsList.jsx';
import { DiagnosisModal } from './components/doctor/DiagnosisModal.jsx';
import { DoctorLoginModal } from './components/auth/DoctorLoginModal.jsx';
import { api } from './services/api.js';
import { Spinner } from './components/common/LoadingSkeleton.jsx';
import { ShieldAlert, Stethoscope, Lock, LayoutDashboard, Calendar, Users, UserCheck } from 'lucide-react';

function MainDoctorWorkspace() {
  const { isDoctor, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [diagnosisAppointment, setDiagnosisAppointment] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [counts, setCounts] = useState({
    todayAppointments: 0,
    totalPatients: 0
  });

  // Fetch quick count metrics for sidebar
  useEffect(() => {
    if (user?.doctorId && isDoctor) {
      async function loadCounts() {
        try {
          const stats = await api.getDoctorStats(user.doctorId);
          setCounts({
            todayAppointments: stats.todayAppointments,
            totalPatients: stats.totalPatients
          });
        } catch (err) {
          console.error('Failed to load count metrics:', err);
        }
      }
      loadCounts();
    }
  }, [user?.doctorId, isDoctor, activeTab, diagnosisAppointment]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-white">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400 font-mono">Initializing Doctor Workspace...</p>
      </div>
    );
  }

  // Security Check: Enforce Doctor Role Authorization
  if (!isDoctor) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Access Restricted</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This module is protected under Hospital Role-Based Access Control (RBAC). Only authenticated Doctors can view patient files, appointment schedules, and clinical records.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              Current Logged User Role:{' '}
              <strong className="text-amber-400 uppercase font-mono">{user?.role || 'Guest'}</strong>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Authenticate as Doctor</span>
          </button>
        </div>

        <DoctorLoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {/* Mobile Tab Selector */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'appointments' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'patients' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patients</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'profile' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </div>

          {/* Active View Router */}
          {activeTab === 'dashboard' && (
            <DoctorDashboard
              setActiveTab={setActiveTab}
              onSelectAppointmentForDiagnosis={(appt) => setDiagnosisAppointment(appt)}
              onSelectPatient={(patientId) => setSelectedPatientId(patientId)}
            />
          )}

          {activeTab === 'profile' && <DoctorProfile />}

          {activeTab === 'patients' && (
            <PatientsList onSelectPatient={(patientId) => setSelectedPatientId(patientId)} />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsList
              onSelectAppointmentForDiagnosis={(appt) => setDiagnosisAppointment(appt)}
              onSelectPatient={(patientId) => setSelectedPatientId(patientId)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedPatientId && (
        <PatientDetailsModal
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          onSelectAppointmentForDiagnosis={(appt) => setDiagnosisAppointment(appt)}
        />
      )}

      {diagnosisAppointment && (
        <DiagnosisModal
          appointment={diagnosisAppointment}
          onClose={() => setDiagnosisAppointment(null)}
          onSuccess={() => {
            // Trigger refresh
            setDiagnosisAppointment(null);
          }}
        />
      )}

      <DoctorLoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainDoctorWorkspace />
      </AuthProvider>
    </ToastProvider>
  );
}

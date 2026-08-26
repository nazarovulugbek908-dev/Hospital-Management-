// Main Hospital Management System Application (Doctor & Patient Modules)

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider, useToast } from './components/common/ToastContainer.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';

// Doctor Components
import { DoctorDashboard } from './components/doctor/DoctorDashboard.jsx';
import { DoctorProfile } from './components/doctor/DoctorProfile.jsx';
import { PatientsList } from './components/doctor/PatientsList.jsx';
import { PatientDetailsModal } from './components/doctor/PatientDetailsModal.jsx';
import { AppointmentsList } from './components/doctor/AppointmentsList.jsx';
import { DiagnosisModal } from './components/doctor/DiagnosisModal.jsx';

// Patient Components
import { PatientDashboard } from './components/patient/PatientDashboard.jsx';
import { PatientProfile } from './components/patient/PatientProfile.jsx';
import { FindDoctors } from './components/patient/FindDoctors.jsx';
import { DoctorDetailsModal } from './components/patient/DoctorDetailsModal.jsx';
import { BookAppointmentModal } from './components/patient/BookAppointmentModal.jsx';
import { PatientAppointments } from './components/patient/PatientAppointments.jsx';
import { PatientAppointmentDetailsModal } from './components/patient/PatientAppointmentDetailsModal.jsx';
import { CancelConfirmModal } from './components/patient/CancelConfirmModal.jsx';
import { PatientLoginModal } from './components/auth/PatientLoginModal.jsx';

import { api } from './services/api.js';
import { Spinner } from './components/common/LoadingSkeleton.jsx';
import { ShieldAlert, Stethoscope, Lock, LayoutDashboard, Calendar, Users, UserCheck, Search, Heart } from 'lucide-react';

function MainWorkspace() {
  const { user, isDoctor, isPatient, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');

  // Doctor Modals
  const [selectedDoctorPatientId, setSelectedDoctorPatientId] = useState(null);
  const [diagnosisAppointment, setDiagnosisAppointment] = useState(null);

  // Patient Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);
  const [selectedPatientAppointment, setSelectedPatientAppointment] = useState(null);
  const [cancelTargetAppointment, setCancelTargetAppointment] = useState(null);

  // Auth / Role Switcher Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Count metrics for sidebar badges
  const [counts, setCounts] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    upcomingCount: 0
  });

  const loadCounts = async () => {
    try {
      if (isDoctor && user?.doctorId) {
        const stats = await api.getDoctorStats(user.doctorId);
        setCounts(prev => ({
          ...prev,
          todayAppointments: stats.todayAppointments,
          totalPatients: stats.totalPatients
        }));
      } else if (isPatient && user?.patientId) {
        const stats = await api.getPatientDashboardStats(user.patientId);
        setCounts(prev => ({
          ...prev,
          upcomingCount: stats.upcomingCount
        }));
      }
    } catch (err) {
      console.error('Error fetching sidebar count metrics:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadCounts();
    }
  }, [user, isDoctor, isPatient, activeTab, isBookingOpen, cancelTargetAppointment]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-white">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400 font-mono">Initializing Hospital Management Portal...</p>
      </div>
    );
  }

  const handleOpenBooking = (doc = null) => {
    setBookingDoctor(doc);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onBookAppointment={() => handleOpenBooking()}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
          onBookAppointment={() => handleOpenBooking()}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {/* Mobile Tab Navigator */}
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

            {isPatient ? (
              <>
                <button
                  onClick={() => setActiveTab('findDoctors')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'findDoctors' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Doctors</span>
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
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'appointments' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Consultations</span>
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'patients' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>My Patients</span>
                </button>
              </>
            )}

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

          {/* PATIENT VIEWS */}
          {isPatient && (
            <>
              {activeTab === 'dashboard' && (
                <PatientDashboard
                  setActiveTab={setActiveTab}
                  onBookAppointment={handleOpenBooking}
                  onSelectAppointment={(appt) => setSelectedPatientAppointment(appt)}
                  onCancelAppointment={(appt) => setCancelTargetAppointment(appt)}
                />
              )}

              {activeTab === 'profile' && <PatientProfile />}

              {activeTab === 'findDoctors' && (
                <FindDoctors
                  onBookAppointment={(doc) => handleOpenBooking(doc)}
                  onSelectDoctor={(doc) => setSelectedDoctorDetails(doc)}
                />
              )}

              {activeTab === 'appointments' && (
                <PatientAppointments
                  onBookAppointment={handleOpenBooking}
                  onSelectAppointment={(appt) => setSelectedPatientAppointment(appt)}
                  onCancelAppointment={(appt) => setCancelTargetAppointment(appt)}
                />
              )}
            </>
          )}

          {/* DOCTOR VIEWS */}
          {isDoctor && (
            <>
              {activeTab === 'dashboard' && (
                <DoctorDashboard
                  setActiveTab={setActiveTab}
                  onSelectAppointmentForDiagnosis={(appt) => setDiagnosisAppointment(appt)}
                  onSelectPatient={(patientId) => setSelectedDoctorPatientId(patientId)}
                />
              )}

              {activeTab === 'profile' && <DoctorProfile />}

              {activeTab === 'patients' && (
                <PatientsList onSelectPatient={(patientId) => setSelectedDoctorPatientId(patientId)} />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsList
                  onSelectAppointmentForDiagnosis={(appt) => setDiagnosisAppointment(appt)}
                  onSelectPatient={(patientId) => setSelectedDoctorPatientId(patientId)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Shared & Role Specific Modals */}

      {/* Doctor Modals */}
      {selectedDoctorPatientId && (
        <PatientDetailsModal
          patientId={selectedDoctorPatientId}
          onClose={() => setSelectedDoctorPatientId(null)}
          onSelectAppointmentForDiagnosis={(appt) => setDiagnosisAppointment(appt)}
        />
      )}

      {diagnosisAppointment && (
        <DiagnosisModal
          appointment={diagnosisAppointment}
          onClose={() => setDiagnosisAppointment(null)}
          onSuccess={() => {
            setDiagnosisAppointment(null);
            loadCounts();
          }}
        />
      )}

      {/* Patient Modals */}
      {selectedDoctorDetails && (
        <DoctorDetailsModal
          doctor={selectedDoctorDetails}
          onClose={() => setSelectedDoctorDetails(null)}
          onBookAppointment={(doc) => handleOpenBooking(doc)}
        />
      )}

      {isBookingOpen && (
        <BookAppointmentModal
          initialDoctor={bookingDoctor}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setBookingDoctor(null);
          }}
          onSuccess={() => {
            loadCounts();
            setActiveTab('appointments');
          }}
        />
      )}

      {selectedPatientAppointment && (
        <PatientAppointmentDetailsModal
          appointment={selectedPatientAppointment}
          onClose={() => setSelectedPatientAppointment(null)}
          onCancelAppointment={(appt) => setCancelTargetAppointment(appt)}
        />
      )}

      {cancelTargetAppointment && (
        <CancelConfirmModal
          appointment={cancelTargetAppointment}
          onClose={() => setCancelTargetAppointment(null)}
          onSuccess={() => {
            loadCounts();
          }}
        />
      )}

      {/* Role / Login Switcher Modal */}
      <PatientLoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainWorkspace />
      </AuthProvider>
    </ToastProvider>
  );
}

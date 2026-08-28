// Main Hospital Management System Application (Multilingual + Admin + Doctor + Patient)

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';
import { ToastProvider, useToast } from './components/common/ToastContainer.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';

// Auth Component
import { AuthPage } from './components/auth/AuthPage.jsx';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard.jsx';

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

import { api } from './services/api.js';
import { Spinner } from './components/common/LoadingSkeleton.jsx';
import { LayoutDashboard, Calendar, Users, UserCheck, Search, Stethoscope, Building2, BarChart3, ShieldCheck } from 'lucide-react';

function MainWorkspace() {
  const { user, isAdmin, isDoctor, isPatient, loading: authLoading } = useAuth();
  const { t } = useLanguage();
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

  // Auth / Role Switcher state
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  // Count metrics for sidebar badges
  const [counts, setCounts] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
    pendingAppointments: 0,
    totalDepartments: 0,
    upcomingCount: 0
  });

  const loadCounts = async () => {
    try {
      if (isAdmin) {
        const stats = await api.getAdminStats();
        setCounts(prev => ({
          ...prev,
          totalDoctors: stats.totalDoctors,
          totalPatients: stats.totalPatients,
          pendingAppointments: stats.pendingAppointments,
          totalDepartments: stats.totalDepartments
        }));
      } else if (isDoctor && user?.doctorId) {
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
      console.error('Error fetching count metrics:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadCounts();
    }
  }, [user, isAdmin, isDoctor, isPatient, activeTab, isBookingOpen, cancelTargetAppointment]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-white font-sans">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400 font-mono">Initializing MedPulse Care Portal...</p>
      </div>
    );
  }

  // If user is not logged in or explicitly requested Auth Screen
  if (!user || showAuthScreen) {
    return (
      <AuthPage
        onAuthSuccess={() => {
          setShowAuthScreen(false);
          setActiveTab('dashboard');
        }}
      />
    );
  }

  const handleOpenBooking = (doc = null) => {
    setBookingDoctor(doc);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setShowAuthScreen(true)}
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
          <div className="md:hidden flex overflow-x-auto gap-2 pb-3 mb-4 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t('navDashboard')}</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'doctors' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{t('navDoctors')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'patients' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('navPatients')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'appointments' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('navAppointments')}</span>
                </button>
              </>
            )}

            {isPatient && (
              <>
                <button
                  onClick={() => setActiveTab('findDoctors')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'findDoctors' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('navFindDoctors')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'appointments' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('navAppointments')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'profile' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('navProfile')}</span>
                </button>
              </>
            )}

            {isDoctor && (
              <>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'appointments' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('navAppointments')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'patients' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('navPatients')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'profile' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('navProfile')}</span>
                </button>
              </>
            )}
          </div>

          {/* Active View Router */}

          {/* ADMIN VIEWS */}
          {isAdmin && (
            <>
              {activeTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
              {activeTab === 'doctors' && (
                <FindDoctors
                  onBookAppointment={(doc) => handleOpenBooking(doc)}
                  onSelectDoctor={(doc) => setSelectedDoctorDetails(doc)}
                />
              )}
              {activeTab === 'patients' && (
                <PatientsList onSelectPatient={(patientId) => setSelectedDoctorPatientId(patientId)} />
              )}
              {activeTab === 'appointments' && (
                <AppointmentsList
                  onSelectAppointmentForDiagnosis={(appt) => setDiagnosisAppointment(appt)}
                  onSelectPatient={(patientId) => setSelectedDoctorPatientId(patientId)}
                />
              )}
              {activeTab === 'departments' && <AdminDashboard setActiveTab={setActiveTab} />}
              {activeTab === 'statistics' && <AdminDashboard setActiveTab={setActiveTab} />}
            </>
          )}

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

      {/* Doctor & Admin Modals */}
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

      {/* Patient & Shared Modals */}
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
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainWorkspace />
        </AuthProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}

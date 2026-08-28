import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  CalendarCheck,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Phone,
  Mail,
  UserPlus,
  Search
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { Badge, Avatar } from '../../components/common/Badge.jsx';
import { AddDoctorModal } from '../../components/admin/AddDoctorModal.jsx';
import { AddPatientModal } from '../../components/admin/AddPatientModal.jsx';

export function AdminDashboard() {
  const {
    adminStats,
    doctors,
    patients,
    appointments,
    addDoctor,
    addPatient,
    updateAppointmentStatus
  } = useHospital();

  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const handleSaveDoctor = (doctorData) => {
    addDoctor(doctorData);
    showToast(
      lang === 'uz' ? `Yangi shifokor ${doctorData.name} qo‘shildi!` : `Doctor ${doctorData.name} added successfully!`,
      'success'
    );
  };

  const handleSavePatient = (patientData) => {
    addPatient(patientData);
    showToast(
      lang === 'uz' ? `Yangi bemor ${patientData.name} ro‘yxatga olindi!` : `Patient ${patientData.name} enrolled successfully!`,
      'success'
    );
  };

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    showToast(
      lang === 'uz' ? `Qabul holati: ${newStatus}` : `Appointment status updated to ${newStatus}`,
      'info'
    );
  };

  const recentPatients = patients.slice(0, 5);
  const recentDoctors = doctors.slice(0, 4);
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-200 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t('adminPortal')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lang === 'uz' ? 'Kasalxona Boshqaruv Markazi' : lang === 'ru' ? 'Центр Управления Клиникой' : 'Hospital Command Center'}
            </h1>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              {lang === 'uz'
                ? 'Shifokorlar va bemorlarni boshqaring, yangi mutaxassislarni qo‘shing hamda qabullarni to‘liq nazorat qiling.'
                : 'Manage medical staff, enroll patients, schedule visits, and monitor real-time clinical activity.'}
            </p>
          </div>

          {/* Quick Add Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('addPatient')}</span>
            </button>
            <button
              onClick={() => setIsAddDoctorOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm shadow-lg shadow-black/10 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addDoctor')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={Users}
          label={t('totalPatients')}
          value={adminStats.totalPatients}
          trend={lang === 'uz' ? 'Ro‘yxatda faol' : 'Enrolled active'}
          trendUp={true}
          color="emerald"
        />
        <StatCard
          icon={Stethoscope}
          label={t('totalDoctors')}
          value={adminStats.totalDoctors}
          trend={lang === 'uz' ? 'Malakali shifokor' : 'Accredited staff'}
          trendUp={true}
          color="blue"
        />
        <StatCard
          icon={Calendar}
          label={t('allAppointments')}
          value={adminStats.totalAppointments}
          trend={lang === 'uz' ? 'Jami bronlar' : 'Total bookings'}
          trendUp={true}
          color="indigo"
        />
        <StatCard
          icon={Clock}
          label={t('pendingAppointments')}
          value={adminStats.pendingAppointments}
          trend={lang === 'uz' ? 'Tasdiq kutilmoqda' : 'Awaiting review'}
          trendUp={false}
          color="amber"
        />
      </div>

      {/* Main Grid: Recent Patients & Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Patients Table (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'uz' ? 'So‘nggi Ro‘yxatga Olingan Bemorlar' : 'Recent Patients'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {patients.length} {lang === 'uz' ? 'nafar bemor ro‘yxatda' : 'total patients enrolled'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddPatientOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('addNew')}</span>
              </button>
              <Link
                to="/admin/patients"
                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title={t('viewAll')}
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentPatients.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <Avatar src={p.avatar} alt={p.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {p.medicalCondition || p.phone || p.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-black">
                    {p.bloodGroup || 'A+'}
                  </span>
                  <Badge variant={p.status === 'Active' ? 'success' : 'neutral'}>
                    {p.status || 'Active'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/patients"
            className="block text-center py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors"
          >
            {lang === 'uz' ? 'Barcha bemorlar ro‘yxatini ko‘rish' : 'View all patient directories'} →
          </Link>
        </div>

        {/* Right Column: Hospital Doctors (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'uz' ? 'Klinika Shifokorlari' : 'Clinical Doctors'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {doctors.length} {lang === 'uz' ? 'nafar mutaxassis' : 'specialists active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddDoctorOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('addNew')}</span>
              </button>
              <Link
                to="/admin/doctors"
                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title={t('viewAll')}
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {recentDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={doc.avatar} alt={doc.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                      {doc.department} • {doc.specialization}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black text-slate-900 dark:text-white flex-shrink-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700">
                  {doc.fee}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/admin/doctors"
            className="block text-center py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors"
          >
            {lang === 'uz' ? 'Barcha shifokorlar kabineti' : 'Manage all doctor rosters'} →
          </Link>
        </div>

      </div>

      {/* Bottom Section: Recent Appointments Monitoring */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'uz' ? 'So‘nggi Qabullar Monitoringi' : 'Appointment Activity'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'uz' ? 'Qabullarni tasdiqlash va holatini o‘zgartirish' : 'Review status and confirm slots'}
              </p>
            </div>
          </div>

          <Link
            to="/admin/appointments"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">{t('doctorName')}</th>
                <th className="pb-3 pr-4">{t('date')} & {t('time')}</th>
                <th className="pb-3 pr-4">{t('department')}</th>
                <th className="pb-3 pr-4">{t('status')}</th>
                <th className="pb-3 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {recentAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-slate-400">
                    #{apt.id.slice(-5)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={apt.doctorAvatar} alt={apt.doctorName} size="xs" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        {apt.doctorName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                    <div>{apt.date}</div>
                    <div className="text-[11px] text-slate-400">{apt.time}</div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                    {apt.department}
                  </td>
                  <td className="py-3.5 pr-4">
                    <Badge
                      variant={
                        apt.status === 'Confirmed' ? 'success' :
                        apt.status === 'Completed' ? 'primary' :
                        apt.status === 'Cancelled' ? 'danger' : 'warning'
                      }
                    >
                      {apt.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right space-x-1">
                    {apt.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 transition-colors text-[11px]"
                      >
                        {lang === 'uz' ? 'Tasdiqlash' : 'Confirm'}
                      </button>
                    )}
                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'Completed')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 transition-colors text-[11px]"
                      >
                        {lang === 'uz' ? 'Yakunlash' : 'Complete'}
                      </button>
                    )}
                    {apt.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                        className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-[11px]"
                      >
                        {lang === 'uz' ? 'Bekor qilish' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddDoctorModal
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        onSave={handleSaveDoctor}
      />

      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onSave={handleSavePatient}
      />

    </div>
  );
}

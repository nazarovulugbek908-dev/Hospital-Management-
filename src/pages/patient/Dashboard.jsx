import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle2,
  UserCheck,
  Clock,
  Search,
  PlusCircle,
  Calendar,
  FileText,
  Eye,
  X,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Activity,
  AlertCircle,
  CheckSquare,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge, Avatar } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/Modal.jsx';

export function Dashboard() {
  const { patient } = useAuth();
  const { stats, appointments, cancelAppointment, doctors, tasks, toggleTaskStatus } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [cancelModalId, setCancelModalId] = useState(null);

  // Find next confirmed or upcoming appointment for this patient
  const nextAppt = appointments.find(a => a.status === 'Confirmed' || a.status === 'Pending') || appointments[0];

  const handleConfirmCancel = () => {
    if (cancelModalId) {
      cancelAppointment(cancelModalId);
      showToast(lang === 'uz' ? 'Qabul bekor qilindi.' : lang === 'ru' ? 'Прием отменен.' : 'Appointment cancelled.', 'info');
      setCancelModalId(null);
    }
  };

  const quickActions = [
    {
      title: t('findDoctors'),
      desc: t('findDoctorDesc'),
      icon: Search,
      to: '/patient/doctors',
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: t('bookVisit'),
      desc: t('bookApptDesc'),
      icon: PlusCircle,
      to: '/patient/book-appointment',
      color: 'from-sky-500 to-cyan-500',
      textColor: 'text-sky-600 dark:text-sky-400'
    },
    {
      title: t('myAppointments'),
      desc: t('myApptDesc'),
      icon: Calendar,
      to: '/patient/appointments',
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: t('medicalRecords'),
      desc: t('medRecordsDesc'),
      icon: FileText,
      to: '/patient/medical-records',
      color: 'from-purple-500 to-violet-500',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('greeting')}, {patient?.name?.split(' ')[0] || 'Patient'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('welcomeBack')}
          </p>
        </div>

        <Link
          to="/patient/book-appointment"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('bookNewAppointment')}</span>
        </Link>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('upcomingAppointments')}
          value={stats.upcomingAppointments}
          subtitle={t('scheduledVisits')}
          icon={CalendarCheck}
          trend={stats.upcomingAppointments > 0 ? `${stats.upcomingAppointments} Active` : "0 Visits"}
          trendType="up"
          color="primary"
        />
        <StatCard
          title={t('completedAppointments')}
          value={stats.completedAppointments}
          subtitle={t('pastConsultations')}
          icon={CheckCircle2}
          trend="Recorded"
          trendType="neutral"
          color="success"
        />
        <StatCard
          title={t('availableDoctors')}
          value={stats.availableDoctors}
          subtitle={t('accreditedSpecialists')}
          icon={UserCheck}
          trend="Online"
          trendType="up"
          color="secondary"
        />
        <StatCard
          title={t('activeTasks')}
          value={tasks.filter(t => t.status !== 'Completed').length}
          subtitle={t('todoItems')}
          icon={CheckSquare}
          trend={`${tasks.filter(t => t.status === 'Completed').length} Done`}
          trendType="up"
          color="warning"
        />
      </div>

      {/* Highlighted Upcoming Appointment Card */}
      {nextAppt && (
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  {t('nextConsultation')}
                </span>
              </div>
              <Badge variant="success" className="bg-white/20 text-white border-white/30 text-xs px-3 py-1 font-bold">
                {nextAppt.status}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={nextAppt.doctorAvatar}
                  name={nextAppt.doctorName}
                  size="xl"
                  className="ring-4 ring-white/30 shadow-md"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {nextAppt.doctorName}
                  </h3>
                  <p className="text-sm font-semibold text-blue-100">
                    {nextAppt.department} • {nextAppt.specialization || 'Clinical Specialist'}
                  </p>
                  <p className="text-xs text-blue-200 mt-1 max-w-md line-clamp-1">
                    {nextAppt.reason}
                  </p>
                </div>
              </div>

              {/* Schedule details */}
              <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs">
                <div className="space-y-1">
                  <span className="text-blue-200 block text-[10px] font-bold uppercase">{t('date')}</span>
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-white" />
                    {nextAppt.date}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="space-y-1">
                  <span className="text-blue-200 block text-[10px] font-bold uppercase">{t('time')}</span>
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-white" />
                    {nextAppt.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={`/patient/appointments/${nextAppt.id}`}
                className="px-5 py-2.5 rounded-xl bg-white text-blue-600 text-xs font-bold shadow-md hover:bg-blue-50 transition-all flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>{t('viewDetails')}</span>
              </Link>

              {nextAppt.status !== 'Cancelled' && nextAppt.status !== 'Completed' && (
                <button
                  onClick={() => setCancelModalId(nextAppt.id)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>{t('cancelAppointment')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personalized Patient Tasks Widget */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('healthTasks')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {patient?.name || 'Patient'} {t('taskTrackerFor')}
              </p>
            </div>
          </div>

          <Link
            to="/todo"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')} ({tasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {tasks.slice(0, 4).map((task) => {
            const isCompleted = task.status === 'Completed';
            return (
              <div
                key={task.id}
                onClick={() => {
                  toggleTaskStatus(task.id);
                  if (!isCompleted) showToast(lang === 'uz' ? 'Vazifa bajarildi! 🎉' : lang === 'ru' ? 'Задача выполнена! 🎉' : 'Task completed! 🎉', 'success');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isCompleted
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-70'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/60 hover:border-blue-500/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => {}}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {task.category || 'Personal'}
                    </span>
                    <span className={`text-[10px] font-bold ${task.priority === 'High' ? 'text-rose-500' : 'text-slate-400'}`}>
                      • {task.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Quick Action Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {t('quickActions')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <Link
                key={i}
                to={qa.to}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${qa.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {qa.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {qa.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>{t('open')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recommended Doctors Preview */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('recommendedDoctors')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('recommendedDesc')}
            </p>
          </div>

          <Link
            to="/patient/doctors"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t('exploreAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {doctors.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar src={doc.avatar} name={doc.name} size="md" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{doc.department}</p>
                  <span className="text-[10px] text-amber-500 font-semibold">★ {doc.rating}</span>
                </div>
              </div>

              <Link
                to={`/patient/book-appointment?doctor=${doc.id}`}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {t('book')}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelModalId}
        onClose={() => setCancelModalId(null)}
        onConfirm={handleConfirmCancel}
        title={t('cancelAppointment') + "?"}
        message={lang === 'uz' ? "Ushbu qabulni bekor qilmoqchimisiz?" : lang === 'ru' ? "Вы уверены, что хотите отменить эту запись?" : "Are you sure you want to cancel this consultation? This action cannot be undone."}
        confirmText={t('cancelAppointment')}
      />
    </div>
  );
}

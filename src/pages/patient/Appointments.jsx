import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  X,
  Plus,
  Eye,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { AppointmentCard } from '../../components/appointments/AppointmentCard.jsx';
import { ConfirmDialog } from '../../components/common/Modal.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { Button } from '../../components/common/Button.jsx';

export function Appointments() {
  const { appointments, cancelAppointment } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [cancelModalId, setCancelModalId] = useState(null);

  const upcomingList = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const completedList = appointments.filter(a => a.status === 'Completed');
  const cancelledList = appointments.filter(a => a.status === 'Cancelled');

  const getFilteredAppointments = () => {
    switch (activeTab) {
      case 'Completed':
        return completedList;
      case 'Cancelled':
        return cancelledList;
      case 'Upcoming':
      default:
        return upcomingList;
    }
  };

  const currentList = getFilteredAppointments();

  const handleConfirmCancel = () => {
    if (cancelModalId) {
      cancelAppointment(cancelModalId);
      showToast(lang === 'uz' ? 'Qabul bekor qilindi.' : 'Appointment cancelled successfully.', 'info');
      setCancelModalId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>{t('myAppointmentsTitle')}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('myAppointmentsSubtitle')}
          </p>
        </div>

        <Link
          to="/patient/book-appointment"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('bookNewAppointment')}</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'Upcoming', label: t('tabUpcoming'), count: upcomingList.length },
          { id: 'Completed', label: t('tabCompleted'), count: completedList.length },
          { id: 'Cancelled', label: t('tabCancelled'), count: cancelledList.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Appointment Cards Grid */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={activeTab === 'Upcoming' ? t('noUpcomingAppts') : t('noApptsFound')}
          description={
            activeTab === 'Upcoming'
              ? t('noUpcomingDesc')
              : t('noApptsFound')
          }
          actionLabel={activeTab === 'Upcoming' ? t('bookNewAppointment') : undefined}
          onAction={activeTab === 'Upcoming' ? () => navigate('/patient/book-appointment') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onView={(a) => navigate(`/patient/appointments/${a.id}`)}
              onCancel={(id) => setCancelModalId(id)}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelModalId}
        onClose={() => setCancelModalId(null)}
        onConfirm={handleConfirmCancel}
        title={t('cancelConfirmTitle')}
        message={t('cancelConfirmDesc')}
        confirmText={t('confirmCancelBtn')}
      />
    </div>
  );
}

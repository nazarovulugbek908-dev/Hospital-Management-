import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  ArrowLeft,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Avatar, Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ConfirmDialog } from '../../components/common/Modal.jsx';

export function AppointmentDetails() {
  const { id } = useParams();
  const { appointments, cancelAppointment, getAppointmentById } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const appointment = getAppointmentById(id) || appointments.find(a => a.id === id);

  if (!appointment) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('noApptsFound')}</h2>
        <Link to="/patient/appointments" className="text-blue-600 font-bold">{t('backToAppts')}</Link>
      </div>
    );
  }

  const isCancelled = appointment.status === 'Cancelled';
  const isCompleted = appointment.status === 'Completed';

  const statusVariants = {
    Confirmed: 'success',
    Pending: 'warning',
    Completed: 'primary',
    Cancelled: 'danger'
  };

  const handleCancel = () => {
    cancelAppointment(appointment.id);
    showToast(lang === 'uz' ? 'Qabul bekor qilindi.' : 'Appointment has been cancelled.', 'info');
    setIsCancelModalOpen(false);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Back Button */}
      <div>
        <Link
          to="/patient/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToAppts')}</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('refNumber')}</span>
            <h2 className="text-lg font-black font-mono text-slate-900 dark:text-white">#{appointment.id}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{t('status')}:</span>
            <Badge variant={statusVariants[appointment.status] || 'neutral'} size="md" dot>
              {appointment.status}
            </Badge>
          </div>
        </div>

        {/* Doctor Card */}
        <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={appointment.doctorAvatar}
              name={appointment.doctorName}
              size="lg"
              className="ring-2 ring-blue-500/30"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {appointment.doctorName}
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                {appointment.department} • {appointment.specialization || 'Attending Physician'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                MediCare Central Campus, Wing B
              </p>
            </div>
          </div>

          <Link
            to={`/patient/doctors/${appointment.doctorId || 'doc-1'}`}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border hover:bg-slate-50 shadow-sm"
          >
            {t('viewProfile')}
          </Link>
        </div>

        {/* Schedule & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">{t('consultDate')}</span>
            <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {appointment.date}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">{t('consultTime')}</span>
            <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              {appointment.time}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">{t('bookedOn')}</span>
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              {appointment.bookingDate || 'August 24, 2026'}
            </p>
          </div>
        </div>

        {/* Reason & Notes */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('reasonForVisit')}
            </h4>
            <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {appointment.reason || 'General clinical consultation and preventive health review.'}
            </p>
          </div>

          {appointment.symptoms && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('reportedSymptoms')}
              </h4>
              <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {appointment.symptoms}
              </p>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate('/patient/appointments')}
          >
            {t('backToAppts')}
          </Button>

          {!isCancelled && !isCompleted && (
            <Button
              variant="danger"
              icon={X}
              onClick={() => setIsCancelModalOpen(true)}
            >
              {t('cancelThisAppt')}
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        title={t('cancelConfirmTitle')}
        message={t('cancelConfirmDesc')}
        confirmText={t('confirmCancelBtn')}
      />
    </div>
  );
}

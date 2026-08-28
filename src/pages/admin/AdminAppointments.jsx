import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  User,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Avatar, Badge } from '../../components/common/Badge.jsx';

export function AdminAppointments() {
  const { appointments, updateAppointmentStatus } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchStatus = selectedStatus === 'All' || apt.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        apt.doctorName?.toLowerCase().includes(q) ||
        apt.department?.toLowerCase().includes(q) ||
        apt.reason?.toLowerCase().includes(q) ||
        apt.date?.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [appointments, selectedStatus, searchQuery]);

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    showToast(
      lang === 'uz' ? `Qabul holati o‘zgartirildi: ${newStatus}` : `Status updated to ${newStatus}`,
      newStatus === 'Cancelled' ? 'info' : 'success'
    );
  };

  const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('allAppointments')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'uz'
              ? `Klinikada jami ${appointments.length} ta uchrashuv yozuvi qayd etilgan. Qabullarni tasdiqlang yoki bekor qiling.`
              : `Total ${appointments.length} bookings logged. Review consultation statuses and schedules.`}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'uz' ? 'Shifokor, bo‘lim yoki sababi bo‘yicha qidirish...' : 'Search by doctor, department, reason...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map((st) => {
            const count = st === 'All' ? appointments.length : appointments.filter(a => a.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments List / Table */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('noAppointmentsTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t('noAppointmentsDesc')}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">ID & {t('date')}</th>
                  <th className="py-3.5 px-4">{t('doctorName')}</th>
                  <th className="py-3.5 px-4">{t('department')}</th>
                  <th className="py-3.5 px-4">{t('visitReason')}</th>
                  <th className="py-3.5 px-4">{t('status')}</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* ID & Date */}
                    <td className="py-4 px-4 sm:px-6">
                      <span className="font-mono text-[11px] font-bold text-slate-400 block">
                        #{apt.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {apt.date}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {apt.time}
                      </span>
                    </td>

                    {/* Doctor */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={apt.doctorAvatar} alt={apt.doctorName} size="md" />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {apt.doctorName}
                          </p>
                          <p className="text-[11px] text-blue-600 dark:text-blue-400">
                            {apt.specialization || apt.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                      {apt.department}
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      <p className="truncate font-medium">{apt.reason || 'General Checkup'}</p>
                      {apt.symptoms && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {apt.symptoms}
                        </p>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
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

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right space-x-1">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 transition-colors text-xs inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'uz' ? 'Tasdiqlash' : 'Confirm'}</span>
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Completed')}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 transition-colors text-xs inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'uz' ? 'Yakunlash' : 'Complete'}</span>
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs font-bold inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{lang === 'uz' ? 'Bekor qilish' : 'Cancel'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

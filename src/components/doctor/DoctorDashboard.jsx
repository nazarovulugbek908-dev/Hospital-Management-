// Doctor Dashboard Component

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { StatCard } from '../common/StatCard.jsx';
import { StatSkeleton, Spinner } from '../common/LoadingSkeleton.jsx';
import { StatusBadge } from '../common/Badge.jsx';
import { useToast } from '../common/ToastContainer.jsx';
import { Users, Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, FileText, User, Sparkles, Activity } from 'lucide-react';

export function DoctorDashboard({ setActiveTab, onSelectAppointmentForDiagnosis, onSelectPatient }) {
  const { user, doctorProfile, isOnDuty } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDashboardData = async () => {
    if (!user?.doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDoctorStats(user.doctorId);
      setStats(data);
    } catch (err) {
      console.error('Error fetching doctor stats:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.doctorId]);

  const handleQuickStatusUpdate = async (apptId, newStatus) => {
    setUpdatingId(apptId);
    try {
      await api.updateAppointmentStatus(apptId, newStatus);
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      await fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update appointment status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/60 via-slate-900 to-indigo-950/70 border border-teal-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome Back Doctor</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {doctorProfile?.fullName || user?.name || 'Dr. Sarah Jenkins'}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              {doctorProfile?.specialization} • {doctorProfile?.department}. You have{' '}
              <strong className="text-teal-300">{stats?.todayAppointments || 0} appointments</strong> scheduled for today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('appointments')}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              <span>View All Appointments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Patient Roster</span>
            </button>
          </div>
        </div>

        {/* Background glow graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>Practice Performance Overview</span>
          </h3>
          <span className="text-xs text-slate-400">Live API Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Total Patients"
                value={stats?.totalPatients || 0}
                icon={Users}
                color="cyan"
                trend="+12%"
                trendLabel="this mo."
                onClick={() => setActiveTab('patients')}
              />
              <StatCard
                title="Today's Schedule"
                value={stats?.todayAppointments || 0}
                icon={Clock}
                color="emerald"
                trend={stats?.todayAppointments > 0 ? 'Active' : 'Clear'}
                onClick={() => setActiveTab('appointments')}
              />
              <StatCard
                title="Upcoming"
                value={stats?.upcomingAppointments || 0}
                icon={Calendar}
                color="blue"
                onClick={() => setActiveTab('appointments')}
              />
              <StatCard
                title="Completed"
                value={stats?.completedAppointments || 0}
                icon={CheckCircle2}
                color="purple"
                onClick={() => setActiveTab('appointments')}
              />
              <StatCard
                title="Pending Review"
                value={stats?.pendingAppointments || 0}
                icon={AlertCircle}
                color="amber"
                onClick={() => setActiveTab('appointments')}
              />
            </>
          )}
        </div>
      </section>

      {/* Today's Schedule & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule Table/List */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>Today's Consultation Queue</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time patient appointments for today
              </p>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Spinner size="lg" className="mx-auto" />
              <p className="text-xs text-slate-400">Loading today's appointment queue...</p>
            </div>
          ) : !stats?.todayList || stats.todayList.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/60">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">No Appointments Today</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have no consultations scheduled for today. Enjoy your day or review upcoming patient files.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.todayList.map(appt => (
                <div
                  key={appt.id}
                  className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-teal-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={appt.patientAvatar}
                      alt={appt.patientName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4
                        onClick={() => onSelectPatient(appt.patientId)}
                        className="text-sm font-bold text-white hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"
                      >
                        <span>{appt.patientName}</span>
                        <StatusBadge status={appt.status} />
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="text-teal-400 font-semibold">{appt.time}</span>
                        <span>•</span>
                        <span>{appt.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {appt.status !== 'Completed' && (
                      <button
                        onClick={() => onSelectAppointmentForDiagnosis(appt)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Add Diagnosis</span>
                      </button>
                    )}

                    {appt.status === 'Pending' && (
                      <button
                        disabled={updatingId === appt.id}
                        onClick={() => handleQuickStatusUpdate(appt.id, 'Confirmed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        {updatingId === appt.id ? <Spinner size="sm" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>Confirm</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doctor Quick Profile & Guidelines */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
              Doctor Information
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={doctorProfile?.avatar}
                alt="Doctor Profile"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40"
              />
              <div>
                <h4 className="text-base font-bold text-white">{doctorProfile?.fullName}</h4>
                <p className="text-xs text-teal-400">{doctorProfile?.specialization}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{doctorProfile?.department}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Working Days:</span>
                <span className="text-slate-200 font-medium">{doctorProfile?.workingDays?.slice(0, 3).join(', ')}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Working Hours:</span>
                <span className="text-slate-200 font-medium">{doctorProfile?.workingHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="text-slate-200 font-medium">{doctorProfile?.experience}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-teal-400" />
              <span>Edit Doctor Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Patient Dashboard Component

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { StatCard } from '../common/StatCard.jsx';
import { StatSkeleton, Spinner } from '../common/LoadingSkeleton.jsx';
import { StatusBadge } from '../common/Badge.jsx';
import { useToast } from '../common/ToastContainer.jsx';
import { Calendar, Clock, User, Sparkles, ArrowRight, CheckCircle2, AlertCircle, FileText, XCircle, Stethoscope, Search } from 'lucide-react';

export function PatientDashboard({ setActiveTab, onBookAppointment, onSelectAppointment, onCancelAppointment }) {
  const { user, patientProfile } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    if (!user?.patientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPatientDashboardStats(user.patientId);
      setStats(data);
    } catch (err) {
      console.error('Error loading patient dashboard:', err);
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user?.patientId]);

  const nextAppt = stats?.nextAppointment;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/70 via-slate-900 to-cyan-950/70 border border-teal-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patient Care Portal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {patientProfile?.fullName || user?.name || 'Eleanor Vance'}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Track your medical appointments, manage health schedules, and consult top hospital specialists.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onBookAppointment()}
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book New Appointment</span>
            </button>
            <button
              onClick={() => setActiveTab('findDoctors')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-teal-400" />
              <span>Find Specialists</span>
            </button>
          </div>
        </div>

        {/* Glow graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            <span>Appointment Summary</span>
          </h3>
          <span className="text-xs text-slate-400">Live Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Total Appointments"
                value={stats?.totalAppointments || 0}
                icon={Calendar}
                color="cyan"
                onClick={() => setActiveTab('appointments')}
              />
              <StatCard
                title="Upcoming"
                value={stats?.upcomingCount || 0}
                icon={Clock}
                color="emerald"
                trend={stats?.upcomingCount > 0 ? 'Scheduled' : 'None'}
                onClick={() => setActiveTab('appointments')}
              />
              <StatCard
                title="Completed Visits"
                value={stats?.completedCount || 0}
                icon={CheckCircle2}
                color="purple"
                onClick={() => setActiveTab('appointments')}
              />
              <StatCard
                title="Cancelled"
                value={stats?.cancelledCount || 0}
                icon={XCircle}
                color="amber"
                onClick={() => setActiveTab('appointments')}
              />
            </>
          )}
        </div>
      </section>

      {/* Next Appointment Spotlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Appointment Card */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>Next Scheduled Appointment</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Spotlight view of your upcoming medical consultation
              </p>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Spinner size="lg" className="mx-auto" />
              <p className="text-xs text-slate-400">Loading appointment details...</p>
            </div>
          ) : !nextAppt ? (
            <div className="py-12 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/60">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">No Upcoming Appointments</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have no scheduled consultations coming up. Book an appointment with one of our top doctors today.
              </p>
              <button
                onClick={() => onBookAppointment()}
                className="mt-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Schedule Consultation
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={nextAppt.doctorAvatar}
                    alt={nextAppt.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{nextAppt.doctorName}</h4>
                      <StatusBadge status={nextAppt.status} />
                    </div>
                    <p className="text-xs text-teal-400 font-semibold">{nextAppt.doctorSpecialization}</p>
                    <p className="text-[11px] text-slate-400">{nextAppt.department}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right self-start sm:self-center">
                  <span className="text-sm font-bold text-teal-300 block">{nextAppt.date}</span>
                  <span className="text-xs text-slate-400 font-medium">{nextAppt.time}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Reason for Visit:</span>
                <p className="text-slate-300">{nextAppt.reason}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => onSelectAppointment(nextAppt)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
                >
                  View Details & Diagnosis
                </button>
                {nextAppt.status !== 'Completed' && (
                  <button
                    onClick={() => onCancelAppointment(nextAppt)}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/40"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Health Actions & Doctor Search Entry */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
              Quick Patient Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('findDoctors')}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-teal-300">Find Available Doctors</h4>
                    <p className="text-[11px] text-slate-400">Browse by department & specialty</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Appointment History</h4>
                    <p className="text-[11px] text-slate-400">View past visit notes & recommendations</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Patient Profile</h4>
                    <p className="text-[11px] text-slate-400">Update address, emergency contact & info</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

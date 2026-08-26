// Patient Appointments History Component with tab filters and action modals

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { StatusBadge } from '../common/Badge.jsx';
import { TableSkeleton } from '../common/LoadingSkeleton.jsx';
import { Calendar, Clock, User, FileText, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export function PatientAppointments({ onBookAppointment, onSelectAppointment, onCancelAppointment }) {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Upcoming' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'

  const fetchAppointments = async () => {
    if (!user?.patientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPatientAppointments(user.patientId, activeTab);
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
      setError(err.message || 'Failed to load appointment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.patientId, activeTab]);

  const tabs = [
    { id: 'All', label: 'All Appointments' },
    { id: 'Upcoming', label: 'Upcoming' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Confirmed', label: 'Confirmed' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-400" />
            <span>My Appointment History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review past & upcoming doctor consultations, status updates, and medical notes.
          </p>
        </div>

        <button
          onClick={() => onBookAppointment()}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeTab === tab.id
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-md shadow-teal-500/10'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Appointments Grid */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : appointments.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Appointments Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no consultations listed under the <strong className="text-slate-300">{activeTab}</strong> tab filter.
          </p>
          <button
            onClick={() => onBookAppointment()}
            className="mt-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
          >
            Book First Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(appt => (
            <div
              key={appt.id}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/30 rounded-3xl p-5 shadow-xl transition-all duration-200 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Doctor & Specialty Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={appt.doctorAvatar}
                    alt={appt.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{appt.doctorName}</h3>
                    <p className="text-xs font-semibold text-teal-400">{appt.doctorSpecialization}</p>
                    <p className="text-[11px] text-slate-400">{appt.department}</p>
                  </div>
                </div>

                {/* Date & Status */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-bold text-teal-300 block">{appt.date}</span>
                    <span className="text-[11px] text-slate-400">{appt.time}</span>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              </div>

              {/* Visit Reason */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Reason for Consultation:</span>
                <p className="text-slate-300">{appt.reason}</p>
              </div>

              {/* Diagnosis Sneak-peek if available */}
              {appt.diagnosis && (
                <div className="p-3.5 rounded-2xl bg-teal-900/20 border border-teal-500/20 text-xs space-y-1">
                  <span className="font-bold text-teal-300 uppercase text-[10px]">Physician Diagnosis:</span>
                  <p className="text-teal-100">{appt.diagnosis}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => onSelectAppointment(appt)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  View Details & Diagnosis
                </button>

                {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                  <button
                    onClick={() => onCancelAppointment(appt)}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/40 transition-colors"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

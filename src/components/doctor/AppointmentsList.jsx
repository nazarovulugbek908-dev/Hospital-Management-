// Appointments List Component for Doctor Panel with tab filtering and status updates

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { StatusBadge } from '../common/Badge.jsx';
import { TableSkeleton, Spinner } from '../common/LoadingSkeleton.jsx';
import { useToast } from '../common/ToastContainer.jsx';
import { Calendar, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle, Filter, ChevronDown } from 'lucide-react';

export function AppointmentsList({ onSelectAppointmentForDiagnosis, onSelectPatient }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Today' | 'Upcoming' | 'Completed' | 'Cancelled' | 'Pending'
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    if (!user?.doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDoctorAppointments(user.doctorId, activeTab);
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.doctorId, activeTab]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await api.updateAppointmentStatus(appointmentId, newStatus);
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      await fetchAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to change status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [
    { id: 'All', label: 'All Appointments' },
    { id: 'Today', label: "Today's" },
    { id: 'Upcoming', label: 'Upcoming' },
    { id: 'Pending', label: 'Pending' },
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
            <span>Doctor Appointments Schedule</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage consultations, update statuses, and submit diagnosis & treatment recommendations.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          Showing <span className="text-teal-400 font-bold">{appointments.length}</span> consultations
        </div>
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
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Appointments List / Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : appointments.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Appointments Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No consultations found under the <strong className="text-slate-300">{activeTab}</strong> tab filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(appt => (
            <div
              key={appt.id}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/30 rounded-3xl p-5 shadow-xl transition-all duration-200 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={appt.patientAvatar}
                    alt={appt.patientName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3
                      onClick={() => onSelectPatient(appt.patientId)}
                      className="text-base font-bold text-white hover:text-teal-300 cursor-pointer transition-colors"
                    >
                      {appt.patientName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="text-teal-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {appt.date} • {appt.time}
                      </span>
                      <span>•</span>
                      <span className="text-slate-300">{appt.type}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                  <StatusBadge status={appt.status} />

                  {/* Status Dropdown/Selector */}
                  <div className="relative">
                    <select
                      disabled={updatingId === appt.id}
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="Pending">Set Pending</option>
                      <option value="Confirmed">Set Confirmed</option>
                      <option value="Completed">Set Completed</option>
                      <option value="Cancelled">Set Cancelled</option>
                    </select>
                  </div>

                  {/* Diagnosis Button */}
                  <button
                    onClick={() => onSelectAppointmentForDiagnosis(appt)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      appt.diagnosis
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-teal-500 text-slate-950 border-teal-400 hover:bg-teal-400 shadow-md shadow-teal-500/10'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{appt.diagnosis ? 'Edit Diagnosis' : 'Write Diagnosis'}</span>
                  </button>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Reason for Visit:</span>
                <p className="text-slate-300">{appt.reason}</p>
              </div>

              {/* Existing Diagnosis preview if completed */}
              {appt.diagnosis && (
                <div className="p-3.5 rounded-2xl bg-teal-900/20 border border-teal-500/20 text-xs space-y-2">
                  <div>
                    <span className="font-bold text-teal-300 uppercase text-[10px]">Current Diagnosis:</span>
                    <p className="text-teal-100 font-medium">{appt.diagnosis}</p>
                  </div>
                  {appt.recommendations && (
                    <div>
                      <span className="font-bold text-teal-300 uppercase text-[10px]">Recommendations:</span>
                      <p className="text-teal-200/90">{appt.recommendations}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Patients List Component for Doctor Panel with search, filters, and authorization restrictions

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { StatusBadge, GenderBadge } from '../common/Badge.jsx';
import { TableSkeleton } from '../common/LoadingSkeleton.jsx';
import { Users, Search, Filter, Calendar, Phone, Mail, FileText, ChevronRight, UserCheck, ShieldAlert } from 'lucide-react';

export function PatientsList({ onSelectPatient }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  const fetchPatients = async () => {
    if (!user?.doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDoctorPatients(user.doctorId, searchTerm, statusFilter, genderFilter);
      setPatients(data);
    } catch (err) {
      console.error('Error loading doctor patients:', err);
      setError(err.message || 'Failed to fetch patients list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user?.doctorId, searchTerm, statusFilter, genderFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            <span>Assigned Patients</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Doctor restricted patient roster • View patient history, contact info, and medical records.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          Showing <span className="text-teal-400 font-bold">{patients.length}</span> assigned patients
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending Appt</option>
              <option value="Completed">Completed Appt</option>
              <option value="Confirmed">Confirmed Appt</option>
            </select>
          </div>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Patient Cards / Grid */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : patients.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Patients Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No assigned patients match your current search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(patient => (
            <div
              key={patient.id}
              className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name, Gender */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.avatar}
                      alt={patient.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-teal-500/40 transition-colors"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                        {patient.fullName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{patient.age} yrs</span>
                        <GenderBadge gender={patient.gender} />
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={patient.appointmentStatus} />
                </div>

                {/* Patient Contact Info */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 pt-1 border-t border-slate-800/60">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[11px] text-slate-400">Latest Appt:</span>
                    <span className="text-[11px] font-semibold text-slate-200">{patient.latestAppointmentDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPatient(patient.id)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 font-bold text-xs border border-slate-700 hover:border-teal-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>View Complete Medical File</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

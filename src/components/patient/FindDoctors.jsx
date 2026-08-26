// Find Doctors Component for Patient Panel

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { TableSkeleton } from '../common/LoadingSkeleton.jsx';
import { Search, Filter, Stethoscope, Building, Award, Calendar, Clock, Star, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export function FindDoctors({ onBookAppointment, onSelectDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllDoctors(searchTerm, selectedDepartment, selectedSpecialization);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Failed to search doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, selectedDepartment, selectedSpecialization]);

  const departments = [
    'All',
    'Cardiovascular Care',
    'Neurosciences',
    'Pediatric & Adolescent Medicine',
    'Orthopedic Surgery & Sports Medicine'
  ];

  const specializations = [
    'All',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics'
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-400" />
            <span>Hospital Specialists Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse available doctors, check working hours & ratings, and book an appointment.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          Showing <span className="text-teal-400 font-bold">{doctors.length}</span> active doctors
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor name, specialty, department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 max-w-[180px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Filter */}
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            {specializations.map(spec => (
              <option key={spec} value={spec}>
                {spec === 'All' ? 'All Specialties' : spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : doctors.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Doctors Match Your Search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting department filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {doctors.map(doctor => (
            <div
              key={doctor.id}
              className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Doctor Avatar & Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.avatar}
                      alt={doctor.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-teal-500/40 transition-colors"
                    />
                    <div>
                      <h3
                        onClick={() => onSelectDoctor(doctor)}
                        className="text-base font-bold text-white group-hover:text-teal-300 cursor-pointer transition-colors"
                      >
                        {doctor.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-teal-400 mt-0.5">{doctor.specialization}</p>
                      <p className="text-[11px] text-slate-400">{doctor.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doctor.rating || 4.9}</span>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-teal-400" />
                      Experience:
                    </span>
                    <span className="font-semibold text-slate-200">{doctor.experience}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      Working Hours:
                    </span>
                    <span className="font-semibold text-slate-200">{doctor.workingHours}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      Available Days:
                    </span>
                    <span className="font-semibold text-teal-300 text-[11px]">
                      {doctor.workingDays?.slice(0, 3).join(', ')}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onSelectDoctor(doctor)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => onBookAppointment(doctor)}
                  className="py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

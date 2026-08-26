// Doctor Details Modal for Patients

import React from 'react';
import { X, Stethoscope, Award, Building, Calendar, Clock, Star, MapPin, User, CheckCircle2 } from 'lucide-react';

export function DoctorDetailsModal({ doctor, onClose, onBookAppointment }) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Doctor Profile & Qualifications</h3>
              <p className="text-xs text-slate-400">Hospital Medical Specialist</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Doctor Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={doctor.avatar}
                alt={doctor.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500/40 shadow-lg"
              />
              <div>
                <h4 className="text-xl font-bold text-white">{doctor.fullName}</h4>
                <p className="text-xs font-semibold text-teal-400 mt-1">{doctor.specialization}</p>
                <p className="text-xs text-slate-400 mt-0.5">{doctor.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{doctor.rating || 4.9} Rating</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-teal-400" />
                Experience:
              </span>
              <p className="text-sm font-bold text-white">{doctor.experience}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-teal-400" />
                Working Hours:
              </span>
              <p className="text-xs font-bold text-white">{doctor.workingHours}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-teal-400" />
                Office Cabinet:
              </span>
              <p className="text-xs font-bold text-white">{doctor.roomNo}</p>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              <span>Medical Biography & Specialty</span>
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
              {doctor.biography || 'No biography provided.'}
            </p>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Available Days</span>
            </h5>
            <div className="flex flex-wrap gap-2">
              {doctor.workingDays?.map(day => (
                <span
                  key={day}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Profile
          </button>

          <button
            onClick={() => {
              onClose();
              onBookAppointment(doctor);
            }}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment with {doctor.fullName.split(' ')[1] || 'Doctor'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

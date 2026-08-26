// Read-Only Patient Appointment Details Modal

import React from 'react';
import { StatusBadge } from '../common/Badge.jsx';
import { X, Calendar, Clock, User, FileText, CheckCircle2, Stethoscope, Lock, ShieldCheck } from 'lucide-react';

export function PatientAppointmentDetailsModal({ appointment, onClose, onCancelAppointment }) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Appointment Record & Medical File</h3>
              <p className="text-xs text-slate-400">Read-Only Patient Medical Record</p>
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
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={appointment.doctorAvatar}
                alt={appointment.doctorName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/30"
              />
              <div>
                <h4 className="text-base font-bold text-white">{appointment.doctorName}</h4>
                <p className="text-xs font-semibold text-teal-400">{appointment.doctorSpecialization}</p>
                <p className="text-[11px] text-slate-400">{appointment.department}</p>
              </div>
            </div>

            <StatusBadge status={appointment.status} />
          </div>

          {/* Date, Time & Consultation Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-teal-400" />
                Date & Time:
              </span>
              <p className="text-sm font-bold text-white">{appointment.date} at {appointment.time}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                Consultation Type:
              </span>
              <p className="text-sm font-bold text-white">{appointment.type || 'General Visit'}</p>
            </div>
          </div>

          {/* Visit Reason */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] block">Patient Visit Purpose:</span>
            <p className="text-slate-200">{appointment.reason}</p>
          </div>

          {/* Medical Clinical Diagnosis (READ ONLY) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Doctor's Clinical Findings & Diagnosis</span>
              </h5>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                Read-Only Record
              </span>
            </div>

            {!appointment.diagnosis ? (
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-500 italic text-center">
                Clinical diagnosis has not yet been submitted by the physician for this consultation.
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-teal-300 uppercase text-[10px] block mb-1">
                    Diagnosis:
                  </span>
                  <p className="text-teal-100 font-medium text-sm">{appointment.diagnosis}</p>
                </div>

                {appointment.recommendations && (
                  <div className="pt-2 border-t border-teal-500/20">
                    <span className="font-bold text-teal-300 uppercase text-[10px] block mb-1">
                      Doctor's Recommendations & Prescriptions:
                    </span>
                    <p className="text-teal-200/90 leading-relaxed whitespace-pre-line">{appointment.recommendations}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>

          {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
            <button
              onClick={() => {
                onClose();
                onCancelAppointment(appointment);
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40"
            >
              Cancel Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

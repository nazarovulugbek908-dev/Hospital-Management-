// Appointment Booking Modal with live slot availability and double-booking prevention

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { useToast } from '../common/ToastContainer.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import { X, Calendar, Clock, User, Stethoscope, FileText, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export function BookAppointmentModal({ initialDoctor, isOpen, onClose, onSuccess }) {
  const { user, patientProfile } = useAuth();
  const { showToast } = useToast();

  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctor?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentType, setAppointmentType] = useState('General Consultation');

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load all doctors for dropdown if not pre-filled
  useEffect(() => {
    async function loadDoctors() {
      setLoadingDoctors(true);
      try {
        const docs = await api.getAllDoctors();
        setDoctorsList(docs);
        if (!selectedDoctorId && docs.length > 0) {
          setSelectedDoctorId(docs[0].id);
        }
      } catch (err) {
        console.error('Error fetching doctors for booking:', err);
      } finally {
        setLoadingDoctors(false);
      }
    }
    if (isOpen) {
      loadDoctors();
    }
  }, [isOpen]);

  // Load available time slots whenever Doctor or Date changes
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDoctorId || !selectedDate) return;
      setLoadingSlots(true);
      setSelectedTime(''); // Reset selected time on doctor/date change
      try {
        const availableSlots = await api.getDoctorAvailableSlots(selectedDoctorId, selectedDate);
        setSlots(availableSlots);
      } catch (err) {
        console.error('Error loading time slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }
    if (isOpen) {
      loadSlots();
    }
  }, [selectedDoctorId, selectedDate, isOpen]);

  if (!isOpen) return null;

  const currentDoctor = doctorsList.find(d => d.id === selectedDoctorId) || initialDoctor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setError('Please select a doctor.');
      return;
    }
    if (!selectedDate) {
      setError('Please choose an appointment date.');
      return;
    }
    if (!selectedTime) {
      setError('Please select an available time slot.');
      return;
    }
    if (!reason.trim()) {
      setError('Please state the reason for your visit.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.bookAppointment({
        patientId: user.patientId,
        doctorId: selectedDoctorId,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        reason: reason.trim()
      });

      showToast('Appointment successfully booked & confirmed!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'Failed to book appointment.');
      showToast(err.message || 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Book Doctor Appointment</h3>
              <p className="text-xs text-slate-400">Select Doctor, Date, Time & Reason</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Doctor Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>1. Select Doctor & Specialty *</span>
            </label>

            {loadingDoctors ? (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
                Loading doctors list...
              </div>
            ) : (
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-semibold"
              >
                {doctorsList.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fullName} — {doc.specialization} ({doc.department})
                  </option>
                ))}
              </select>
            )}

            {currentDoctor && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 text-xs">
                <img
                  src={currentDoctor.avatar}
                  alt={currentDoctor.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <span className="font-bold text-white block">{currentDoctor.fullName}</span>
                  <span className="text-teal-400 text-[11px]">{currentDoctor.specialization}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>2. Select Appointment Date *</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Consultation Type</span>
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-semibold"
              >
                <option value="General Consultation">General Consultation</option>
                <option value="Follow-up Visit">Follow-up Visit</option>
                <option value="Routine Checkup">Routine Checkup</option>
                <option value="Diagnostic Review">Diagnostic Review</option>
              </select>
            </div>
          </div>

          {/* 3. Available Time Slots Grid */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>3. Select Time Slot *</span>
              </label>
              <span className="text-[11px] text-slate-400">Green = Available • Red = Booked</span>
            </div>

            {loadingSlots ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl">
                Checking live slot availability...
              </div>
            ) : slots.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl">
                No slots configured for this date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {slots.map(slot => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      type="button"
                      key={slot.time}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                        !slot.isAvailable
                          ? 'bg-rose-500/10 text-rose-400/50 border-rose-500/20 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                          : 'bg-slate-950 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Visit Reason */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>4. Reason for Visit *</span>
            </label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="Describe symptoms, visit purpose, or specific health concerns..."
            />
          </div>

          {/* 5. Summary Review */}
          {selectedDoctorId && selectedDate && selectedTime && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2 text-xs">
              <span className="font-bold text-teal-300 flex items-center gap-1.5 uppercase text-[10px]">
                <CheckCircle2 className="w-4 h-4" />
                Booking Summary Confirmation
              </span>
              <div className="grid grid-cols-2 gap-2 text-teal-100">
                <div>Doctor: <strong>{currentDoctor?.fullName}</strong></div>
                <div>Department: <strong>{currentDoctor?.department}</strong></div>
                <div>Date: <strong>{selectedDate}</strong></div>
                <div>Time: <strong>{selectedTime}</strong></div>
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedTime}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Spinner size="sm" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Confirm & Book Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

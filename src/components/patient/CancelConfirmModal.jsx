// Cancel Appointment Confirmation Dialog

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { useToast } from '../common/ToastContainer.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import { AlertTriangle, X, Trash2, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export function CancelConfirmModal({ appointment, onClose, onSuccess }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cancelling, setCancelling] = useState(false);

  if (!appointment) return null;

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      await api.cancelAppointment(appointment.id, user.patientId);
      showToast('Appointment successfully cancelled', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      showToast(err.message || 'Failed to cancel appointment', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cancel Appointment</h3>
            <p className="text-xs text-slate-400">Confirmation Required</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <p className="text-slate-300">
            Are you sure you want to cancel your appointment with{' '}
            <strong className="text-white font-bold">{appointment.doctorName}</strong>?
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-slate-400 space-y-1">
            <div>Date: <span className="text-teal-400 font-semibold">{appointment.date}</span></div>
            <div>Time: <span className="text-teal-400 font-semibold">{appointment.time}</span></div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirmCancel}
            disabled={cancelling}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {cancelling ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
            <span>Confirm Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

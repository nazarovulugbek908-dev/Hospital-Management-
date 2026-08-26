// Diagnosis & Treatment Recommendations Modal

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useToast } from '../common/ToastContainer.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import { X, FileText, Stethoscope, Save, AlertCircle, CheckCircle2, User, Calendar } from 'lucide-react';

export function DiagnosisModal({ appointment, onClose, onSuccess }) {
  const { showToast } = useToast();

  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (appointment) {
      setDiagnosis(appointment.diagnosis || '');
      setRecommendations(appointment.recommendations || '');
      setError(null);
      setFieldErrors({});
    }
  }, [appointment]);

  if (!appointment) return null;

  const validate = () => {
    const errs = {};
    if (!diagnosis.trim()) {
      errs.diagnosis = 'Clinical diagnosis is required.';
    }
    if (!recommendations.trim()) {
      errs.recommendations = 'Treatment recommendations and notes are required.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError(null);
    try {
      await api.saveDiagnosisAndRecommendations(appointment.id, {
        diagnosis: diagnosis.trim(),
        recommendations: recommendations.trim()
      });
      showToast('Diagnosis and recommendations saved & persisted!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving diagnosis:', err);
      setError(err.message || 'Failed to save diagnosis details.');
      showToast(err.message || 'Failed to save diagnosis', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Clinical Diagnosis & Treatment Plan</h3>
              <p className="text-xs text-slate-400">Medical Entry for Patient Record</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient & Appointment Context */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-4 px-6 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={appointment.patientAvatar}
              alt={appointment.patientName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <span className="font-bold text-white text-sm block">{appointment.patientName}</span>
              <span className="text-slate-400">{appointment.type}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-teal-400 font-semibold block">{appointment.date}</span>
            <span className="text-slate-400">{appointment.time}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Reason for Visit */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
              Patient Visit Reason:
            </span>
            <p className="text-slate-300">{appointment.reason}</p>
          </div>

          {/* Diagnosis Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Medical Diagnosis *</span>
            </label>
            <textarea
              rows="3"
              value={diagnosis}
              onChange={(e) => {
                setDiagnosis(e.target.value);
                if (fieldErrors.diagnosis) setFieldErrors(prev => ({ ...prev, diagnosis: null }));
              }}
              className={`w-full p-3.5 rounded-2xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors ${
                fieldErrors.diagnosis ? 'border-rose-500' : 'border-slate-800'
              }`}
              placeholder="Enter comprehensive clinical diagnosis, examination findings, and disease stage..."
            />
            {fieldErrors.diagnosis && (
              <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.diagnosis}</p>
            )}
          </div>

          {/* Recommendations Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recommendations & Treatment Plan *</span>
            </label>
            <textarea
              rows="4"
              value={recommendations}
              onChange={(e) => {
                setRecommendations(e.target.value);
                if (fieldErrors.recommendations) setFieldErrors(prev => ({ ...prev, recommendations: null }));
              }}
              className={`w-full p-3.5 rounded-2xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors ${
                fieldErrors.recommendations ? 'border-rose-500' : 'border-slate-800'
              }`}
              placeholder="Enter prescribed medications, dosage, lifestyle modifications, and follow-up timeline..."
            />
            {fieldErrors.recommendations && (
              <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.recommendations}</p>
            )}
          </div>

          {/* Actions */}
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
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
              <span>Save & Complete Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

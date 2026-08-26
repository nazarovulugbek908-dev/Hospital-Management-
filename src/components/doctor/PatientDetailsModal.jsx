// Detailed Patient Modal showing medical history, diagnoses, notes, recommendations & appointment timeline

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { StatusBadge, GenderBadge } from '../common/Badge.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import { X, User, Phone, Mail, Heart, AlertTriangle, Calendar, FileText, Stethoscope, Pill, Clock, CheckCircle2 } from 'lucide-react';

export function PatientDetailsModal({ patientId, onClose, onSelectAppointmentForDiagnosis }) {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('medicalHistory'); // 'medicalHistory' | 'appointments'

  useEffect(() => {
    if (!patientId || !user?.doctorId) return;
    async function loadPatientDetails() {
      setLoading(true);
      setError(null);
      try {
        const details = await api.getPatientDetails(patientId, user.doctorId);
        setPatientData(details);
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError(err.message || 'Failed to load patient record.');
      } finally {
        setLoading(false);
      }
    }
    loadPatientDetails();
  }, [patientId, user?.doctorId]);

  if (!patientId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Patient Clinical File</h3>
              <p className="text-xs text-slate-400">Doctor Access Level • Confidential Medical Record</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <Spinner size="lg" className="mx-auto" />
              <p className="text-xs text-slate-400">Fetching patient medical records securely...</p>
            </div>
          ) : error ? (
            <div className="py-12 px-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
              <p className="font-bold">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold"
              >
                Close Modal
              </button>
            </div>
          ) : patientData ? (
            <div className="space-y-6">
              {/* Patient Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={patientData.avatar}
                    alt={patientData.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-bold text-white">{patientData.fullName}</h4>
                      <GenderBadge gender={patientData.gender} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Age: <strong className="text-slate-200">{patientData.age}</strong> • Blood Group:{' '}
                      <strong className="text-rose-400">{patientData.bloodGroup}</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>{patientData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>{patientData.email}</span>
                  </div>
                </div>
              </div>

              {/* Medical Alerts / Emergency Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <AlertTriangle className="w-4 h-4" />
                    Known Allergies
                  </span>
                  <p className="text-amber-200">
                    {patientData.allergies && patientData.allergies.length > 0
                      ? patientData.allergies.join(', ')
                      : 'No known drug allergies reported'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Heart className="w-4 h-4 text-rose-400" />
                    Emergency Contact
                  </span>
                  <p className="text-slate-200 font-medium">
                    {patientData.emergencyContact || 'None listed'}
                  </p>
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-slate-800 gap-4">
                <button
                  onClick={() => setActiveTab('medicalHistory')}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === 'medicalHistory'
                      ? 'border-teal-500 text-teal-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Diagnoses & Recommendations</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px]">
                    {patientData.medicalHistory?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === 'appointments'
                      ? 'border-teal-500 text-teal-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Appointment History</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px]">
                    {patientData.appointmentHistory?.length || 0}
                  </span>
                </button>
              </div>

              {/* Tab 1: Diagnoses & Recommendations */}
              {activeTab === 'medicalHistory' && (
                <div className="space-y-4">
                  {!patientData.medicalHistory || patientData.medicalHistory.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      <Stethoscope className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No past clinical diagnoses recorded for this patient.</p>
                    </div>
                  ) : (
                    patientData.medicalHistory.map(record => (
                      <div
                        key={record.id}
                        className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4"
                      >
                        <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                          <div>
                            <h5 className="text-sm font-bold text-white">{record.diagnosis}</h5>
                            <p className="text-[11px] text-teal-400">Physician: {record.doctorName}</p>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                            {record.date}
                          </span>
                        </div>

                        {record.notes && (
                          <div className="space-y-1 text-xs">
                            <span className="font-bold text-slate-400 uppercase text-[10px]">Clinical Notes:</span>
                            <p className="text-slate-300 leading-relaxed">{record.notes}</p>
                          </div>
                        )}

                        {record.recommendations && (
                          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-1">
                            <span className="font-bold text-teal-300 flex items-center gap-1.5 uppercase text-[10px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Doctor Recommendations:
                            </span>
                            <p className="text-teal-100 leading-relaxed">{record.recommendations}</p>
                          </div>
                        )}

                        {record.prescriptions && record.prescriptions.length > 0 && (
                          <div className="space-y-1 text-xs">
                            <span className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
                              <Pill className="w-3.5 h-3.5 text-rose-400" />
                              Prescribed Medications:
                            </span>
                            <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                              {record.prescriptions.map((rx, idx) => (
                                <li key={idx}>{rx}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Appointment History */}
              {activeTab === 'appointments' && (
                <div className="space-y-3">
                  {!patientData.appointmentHistory || patientData.appointmentHistory.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No appointment records found.</p>
                    </div>
                  ) : (
                    patientData.appointmentHistory.map(appt => (
                      <div
                        key={appt.id}
                        className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">{appt.type}</span>
                            <StatusBadge status={appt.status} />
                          </div>
                          <p className="text-xs text-slate-400">Reason: {appt.reason}</p>
                          <p className="text-[11px] text-teal-400 font-medium">
                            {appt.date} at {appt.time}
                          </p>
                        </div>

                        {appt.status !== 'Completed' && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectAppointmentForDiagnosis(appt);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-all"
                          >
                            Add Diagnosis
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Patient File
          </button>
        </div>
      </div>
    </div>
  );
}

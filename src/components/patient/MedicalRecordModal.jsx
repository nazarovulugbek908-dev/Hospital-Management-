import React, { useState, useEffect } from 'react';
import { X, FileText, Stethoscope, Calendar, HeartPulse, Sparkles, CheckCircle2, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { departmentsList } from '../../data/mockData.js';
import { Input, Select } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';

export function MedicalRecordModal({ isOpen, onClose, onSave, recordToEdit = null }) {
  const { t, lang } = useLanguage();
  const { doctors } = useHospital();

  const getToday = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: getToday(),
    doctor: '',
    department: 'General Medicine',
    diagnosis: '',
    recommendations: '',
    doctorNotes: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        date: recordToEdit.date || getToday(),
        doctor: recordToEdit.doctor || '',
        department: recordToEdit.department || 'General Medicine',
        diagnosis: recordToEdit.diagnosis || '',
        recommendations: recordToEdit.recommendations || '',
        doctorNotes: recordToEdit.doctorNotes || ''
      });
    } else {
      setFormData({
        date: getToday(),
        doctor: doctors[0]?.name || 'Dr. Medical Specialist',
        department: doctors[0]?.department || 'General Medicine',
        diagnosis: '',
        recommendations: '',
        doctorNotes: ''
      });
    }
    setError('');
  }, [recordToEdit, isOpen, doctors]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.diagnosis.trim()) {
      setError(lang === 'uz' ? 'Tashxis / Xulosa nomini kiriting.' : lang === 'ru' ? 'Введите диагноз / заключение.' : 'Clinical diagnosis is required.');
      return;
    }
    if (!formData.doctor.trim()) {
      setError(lang === 'uz' ? 'Shifokor ismini kiriting.' : lang === 'ru' ? 'Укажите имя врача.' : 'Doctor name is required.');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save medical record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {recordToEdit ? t('editMedicalRecord') : t('addMedicalRecord')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'uz'
                  ? 'Klinik tashxis va shifokor tavsiyalarini qayd qiling'
                  : lang === 'ru'
                  ? 'Зафиксируйте диагноз, лечащего врача и рекомендации'
                  : 'Document clinical diagnosis, attending doctor, and recommendations'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('recordDate')}
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Select
              label={t('department')}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={departmentsList.map(d => ({ value: d, label: d }))}
            />
          </div>

          <div className="space-y-1">
            <Input
              label={t('attendingDoctor')}
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              placeholder="Dr. John Smith"
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              label={t('diagnosisSummary')}
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              placeholder={lang === 'uz' ? 'Masalan: Kardio profilaktik ko‘rik' : lang === 'ru' ? 'Например: Профилактический осмотр' : 'e.g. Annual Cardio Preventive Checkup'}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('treatmentRecommendations')}
            </label>
            <textarea
              rows={3}
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              placeholder={lang === 'uz' ? 'Dori-darmonlar, parhez yoki jismoniy mashqlar tavsiyalari...' : lang === 'ru' ? 'Назначенные медикаменты, диета, лечебные процедуры...' : 'Medications, diet adjustments, or daily routine recommendations...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('notesAndInstructions')}
            </label>
            <textarea
              rows={2}
              value={formData.doctorNotes}
              onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
              placeholder={lang === 'uz' ? 'Shifokor tomonidan qo‘shimcha qaydlar...' : lang === 'ru' ? 'Дополнительные клинические заметки...' : 'Doctor observations or follow-up note...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {recordToEdit ? t('saveChanges') : (lang === 'uz' ? 'Qo‘shish' : lang === 'ru' ? 'Добавить' : 'Add Record')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

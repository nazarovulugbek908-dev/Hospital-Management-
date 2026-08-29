import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Heart,
  Droplet,
  Scale,
  Calendar,
  Stethoscope,
  CheckCircle2,
  Download,
  Share2,
  PlusCircle,
  Edit2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { ConfirmDialog } from '../../components/common/Modal.jsx';
import { MedicalRecordModal } from '../../components/patient/MedicalRecordModal.jsx';

export function MedicalRecords() {
  const { medicalRecords, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const handleSaveRecord = async (formData) => {
    if (recordToEdit) {
      await updateMedicalRecord(recordToEdit.id, formData);
      showToast(lang === 'uz' ? 'Tibbiy xulosa yangilandi.' : lang === 'ru' ? 'Медицинская запись обновлена.' : 'Medical record updated.', 'success');
    } else {
      await addMedicalRecord(formData);
      showToast(lang === 'uz' ? 'Yangi tibbiy yozuv qo‘shildi.' : lang === 'ru' ? 'Новая запись успешно добавлена.' : 'Medical record added successfully.', 'success');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      await deleteMedicalRecord(deleteModalId);
      showToast(lang === 'uz' ? 'Tibbiy yozuv o‘chirildi.' : lang === 'ru' ? 'Запись удалена.' : 'Medical record deleted.', 'info');
    } catch (e) {
      showToast('Failed to delete medical record.', 'error');
    } finally {
      setDeleteModalId(null);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>{t('medicalRecordsTitle')}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('medicalRecordsSubtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => {
            setRecordToEdit(null);
            setIsModalOpen(true);
          }}
        >
          {t('addMedicalRecord')}
        </Button>
      </div>

      {/* Vitals Summary Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('bloodPressure')}</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">120/80</h3>
            <span className="text-xs font-semibold text-slate-400">mmHg</span>
          </div>
          <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            {t('optimalRange')}
          </span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('heartRate')}</span>
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-500">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">72</h3>
            <span className="text-xs font-semibold text-slate-400">bpm</span>
          </div>
          <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            {t('normalResting')}
          </span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('bloodSugar')}</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-500">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">95</h3>
            <span className="text-xs font-semibold text-slate-400">mg/dL</span>
          </div>
          <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            {t('fastingNormal')}
          </span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('bmiWeight')}</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">22.4</h3>
            <span className="text-xs font-semibold text-slate-400">BMI</span>
          </div>
          <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            {t('healthyWeight')}
          </span>
        </div>
      </div>

      {/* Consultation History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('consultationHistory')} ({medicalRecords.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'uz' ? 'Klinik xulosalar va retseptlar' : lang === 'ru' ? 'Клинические заключения и назначения' : 'Documented clinical consultation history'}
          </span>
        </div>

        {medicalRecords.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('noRecordsFound')}
            description={t('noRecordsDesc')}
            actionLabel={t('addMedicalRecord')}
            onAction={() => {
              setRecordToEdit(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {medicalRecords.map((rec) => (
              <div
                key={rec.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5 border-l-4 border-l-blue-600 dark:border-l-blue-500"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-extrabold">{rec.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {rec.department}
                    </Badge>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      {rec.doctor}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setRecordToEdit(rec);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={t('editMedicalRecord')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModalId(rec.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                    {t('clinicalDiagnosis')}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {rec.diagnosis}
                  </h4>
                </div>

                {/* Recommendations */}
                {rec.recommendations && (
                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t('physicianRecommendations')}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                      {rec.recommendations}
                    </p>
                  </div>
                )}

                {/* Doctor Notes */}
                {rec.doctorNotes && (
                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">{t('doctorClinicalNotes')}</span>
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      "{rec.doctorNotes}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medical Record Modal */}
      <MedicalRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRecordToEdit(null);
        }}
        onSave={handleSaveRecord}
        recordToEdit={recordToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        onConfirm={handleConfirmDelete}
        title={t('delete')}
        message={t('deleteRecordConfirm')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        variant="danger"
      />
    </div>
  );
}

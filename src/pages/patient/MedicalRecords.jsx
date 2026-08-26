import React from 'react';
import {
  FileText,
  Calendar,
  Stethoscope,
  HeartPulse,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Download,
  Share2,
  ShieldCheck,
  Droplet,
  Building,
  UserCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';

export function MedicalRecords() {
  const { medicalRecords } = useHospital();
  const { patient } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>{t('medRecordsTitle')}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('medRecordsSubtitle')}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>{t('eduDisclaimer')}</span>
        </div>
      </div>

      {/* Patient Health Summary Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('patientVitalsTitle')}</h3>
          </div>
          <Badge variant="success" size="sm" dot>{t('activeInCare')}</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('restingBP')}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">118/78 mmHg</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{t('normalRange')}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('avgHeartRate')}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">68 bpm</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{t('optimal')}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('bloodGlucose')}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">94 mg/dL</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{t('normalRange')}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('bloodGroupBMI')}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">{patient?.bloodGroup || 'O+'} • 23.6</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{t('healthyIndex')}</span>
          </div>
        </div>
      </div>

      {/* Medical Records Timeline & List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('historyTimeline')}
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {medicalRecords.length} {t('recordedConsultations')}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {medicalRecords.map((rec, index) => (
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
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('physicianRecommendations')}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  {rec.recommendations}
                </p>
              </div>

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
      </div>
    </div>
  );
}

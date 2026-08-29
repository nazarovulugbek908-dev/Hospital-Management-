import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CalendarCheck,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  Building,
  HeartPulse,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { timeSlots } from '../../data/mockData.js';
import { Button } from '../../components/common/Button.jsx';
import { Avatar, Badge } from '../../components/common/Badge.jsx';
import { Input, Select } from '../../components/common/Input.jsx';

export function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctors, bookAppointment } = useHospital();
  const { patient } = useAuth();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const preselectedDoctorId = searchParams.get('doctor');

  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bookedAppointmentResult, setBookedAppointmentResult] = useState(null);

  useEffect(() => {
    if (preselectedDoctorId) {
      const doc = doctors.find(d => d.id === preselectedDoctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setStep(2);
      }
    } else if (!selectedDoctor && doctors.length > 0) {
      setSelectedDoctor(doctors[0]);
    }
  }, [preselectedDoctorId, doctors]);

  const getDisabledSlots = () => {
    return ['09:30 AM', '02:00 PM'];
  };

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      showToast(lang === 'uz' ? 'Iltimos, barcha bosqichlarni to‘ldiring.' : 'Please complete all booking steps.', 'warning');
      return;
    }

    const dateObj = new Date(selectedDate);
    const formattedDate = isNaN(dateObj.getTime())
      ? selectedDate
      : dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newApt = await bookAppointment({
      doctorName: selectedDoctor.name,
      doctorId: selectedDoctor.id,
      doctorAvatar: selectedDoctor.avatar,
      department: selectedDoctor.department,
      specialization: selectedDoctor.specialization,
      date: formattedDate,
      time: selectedTime,
      reason: reason.trim() || (lang === 'uz' ? 'Umumiy konsultatsiya va ko‘rik.' : 'General health consultation and evaluation.'),
      symptoms: symptoms.trim() || (lang === 'uz' ? 'Maxsus o‘tkir shikoyatlar keltirilmadi.' : 'No specific acute symptoms reported.')
    });

    setBookedAppointmentResult(newApt);
    setStep(5);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }

    showToast(lang === 'uz' ? 'Qabul muvaffaqiyatli band qilindi! 🎉' : 'Appointment booked successfully! 🎉', 'success');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <CalendarCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>{t('bookWizardTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('bookWizardSubtitle')}
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      {step <= 4 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {[
            { num: 1, label: t('step1Short') },
            { num: 2, label: t('step2Short') },
            { num: 3, label: t('step3Short') },
            { num: 4, label: t('step4Short') }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                if (s.num < step) setStep(s.num);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                step === s.num
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25'
                  : step > s.num
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="text-xs font-black">Step {s.num}</div>
              <div className="text-[11px] font-semibold truncate mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Wizard Steps Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {/* STEP 1: Choose Doctor */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('step1')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('step1Desc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <Avatar src={doc.avatar} name={doc.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.name}</h4>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">{doc.department}</p>
                      <span className="text-[10px] text-slate-400">{doc.fee || '150 000 so‘m'} • ★ {doc.rating || 5.0}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                disabled={!selectedDoctor}
                icon={ArrowRight}
                iconPosition="right"
              >
                {t('proceedDate')}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Date */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('step2')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('step2Desc')}</p>
              </div>
              {selectedDoctor && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                  <Avatar src={selectedDoctor.avatar} name={selectedDoctor.name} size="xs" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDoctor.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <Input
                label={t('consultDate')}
                type="date"
                min="2026-08-26"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('quickDateSuggestions')}</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'August 28, 2026', val: '2026-08-28' },
                    { label: 'September 02, 2026', val: '2026-09-02' },
                    { label: 'September 08, 2026', val: '2026-09-08' }
                  ].map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDate(d.val)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedDate === d.val
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {d.label.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setStep(1)} icon={ArrowLeft}>
                {t('back')}
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(3)}
                disabled={!selectedDate}
                icon={ArrowRight}
                iconPosition="right"
              >
                {t('proceedTime')}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Pick Time */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('step3')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('step3Desc')} {selectedDate}.</p>
              </div>
              <Badge variant="primary" size="md">
                {selectedDate}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => {
                const isBooked = getDisabledSlots().includes(slot);
                const isSelected = selectedTime === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                      isBooked
                        ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 line-through cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:border-blue-500/50'
                    }`}
                  >
                    <span>{slot}</span>
                    {isBooked ? (
                      <span className="text-[10px] uppercase text-rose-500 font-bold">Booked</span>
                    ) : isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setStep(2)} icon={ArrowLeft}>
                {t('back')}
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(4)}
                disabled={!selectedTime}
                icon={ArrowRight}
                iconPosition="right"
              >
                {t('reviewConfirm')}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('step4')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('step4Desc')}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                <Avatar src={selectedDoctor.avatar} name={selectedDoctor.name} size="lg" />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedDoctor.name}</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{selectedDoctor.department} Specialist</p>
                </div>
                <div className="ml-auto text-right">
                  <Badge variant="warning" size="md">
                    Status: Pending
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('department')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDoctor.department}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('date')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('time')}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{selectedTime}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Input
                  label={t('reasonLabel')}
                  placeholder={t('reasonPlaceholder')}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Input
                  label={t('symptomsLabel')}
                  placeholder={t('symptomsPlaceholder')}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setStep(3)} icon={ArrowLeft}>
                {t('back')}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                icon={CalendarCheck}
              >
                {t('confirmBooking')}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Success Screen */}
        {step === 5 && bookedAppointmentResult && (
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t('bookingSuccess')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t('bookingSuccessDesc')} <strong className="text-slate-900 dark:text-white">{bookedAppointmentResult.doctorName}</strong> ({bookedAppointmentResult.date} • {bookedAppointmentResult.time}).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border max-w-sm mx-auto text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('referenceId')}:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#{bookedAppointmentResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('department')}:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{bookedAppointmentResult.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('status')}:</span>
                <Badge variant="warning" size="sm">Pending Confirmation</Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                icon={CalendarCheck}
                onClick={() => navigate('/patient/appointments')}
              >
                {t('viewMyAppts')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStep(1);
                  setSelectedTime('');
                  setReason('');
                }}
              >
                {t('bookAnother')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

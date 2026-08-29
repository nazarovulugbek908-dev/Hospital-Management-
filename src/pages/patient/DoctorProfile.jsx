import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Calendar,
  Clock,
  Briefcase,
  Award,
  Globe,
  ArrowLeft,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { timeSlots } from '../../data/mockData.js';
import { Avatar, Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';

export function DoctorProfile() {
  const { id } = useParams();
  const { doctors } = useHospital();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const doctor = doctors.find(d => d.id === id);

  if (!doctor) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">{t('noDoctorsFound')}</h2>
        <Link to="/patient/doctors" className="text-blue-600 font-bold">{t('backToDoctors')}</Link>
      </div>
    );
  }

  const daysList = lang === 'uz'
    ? ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma']
    : lang === 'ru'
    ? ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Back Button */}
      <div>
        <Link
          to="/patient/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToDoctors')}</span>
        </Link>
      </div>

      {/* Hero Profile Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Large Profile Photo */}
          <div className="relative flex-shrink-0">
            <Avatar
              src={doctor.avatar}
              name={doctor.name}
              size="xl"
              className="ring-4 ring-blue-500/20 shadow-lg"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {doctor.name}
              </h1>
              <Badge variant="primary" size="md">
                {doctor.department}
              </Badge>
            </div>

            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {doctor.specialization}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              {doctor.education}
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {doctor.reviewsCount > 0 && doctor.rating > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating} {t('rating')} ({doctor.reviewsCount} {t('reviews')})</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>{lang === 'uz' ? 'Yangi mutaxassis (Hozircha baholanmagan)' : lang === 'ru' ? 'Новый специалист (Пока нет отзывов)' : 'New Specialist (No reviews yet)'}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{doctor.experience}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{doctor.availability || t('availableToday')}</span>
              </div>
            </div>
          </div>

          {/* Consultation Fee & Booking CTA */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('consultationFee')}</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{doctor.fee || '150 000 so‘m'}</span>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={CalendarCheck}
              onClick={() => navigate(`/patient/book-appointment?doctor=${doctor.id}`)}
              className="px-6"
            >
              {t('bookAppointment')}
            </Button>
          </div>
        </div>
      </div>

      {/* Details Grid: Bio, Languages, Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Biography (2 Cols) */}
        <div className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t('biography')}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {doctor.biography}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('languagesSpoken')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(doctor.languages || ['English', 'O‘zbekcha', 'Русский']).map((l, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  🌐 {l}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('hospitalLocation')}
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                MediCare Central Medical Hospital
              </p>
              <p className="text-slate-500 pl-5">Department of {doctor.department} • Building C, Floor 3, Suite 302</p>
            </div>
          </div>
        </div>

        {/* Working Hours & Available Schedule (1 Col) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t('workingHours')}</span>
            </h3>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs font-semibold text-blue-600 dark:text-blue-400">
              {doctor.workingHours || '09:00 AM - 05:00 PM'}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('availableDays')}
            </h4>
            <div className="space-y-1.5 text-xs">
              {daysList.map((day, idx) => (
                <div
                  key={day}
                  className="flex items-center justify-between p-2 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-semibold"
                >
                  <span>{day}</span>
                  <span className="text-[10px] font-bold">
                    {idx < 4 ? t('openDay') : t('openDay')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('dailySlots')}
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {timeSlots.slice(0, 6).map((slot, i) => (
                <span
                  key={i}
                  className="px-2 py-1.5 text-center rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 text-[11px]"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            icon={CalendarCheck}
            onClick={() => navigate(`/patient/book-appointment?doctor=${doctor.id}`)}
          >
            {t('bookWith')} {doctor.name.split(' ')[1]}
          </Button>
        </div>
      </div>
    </div>
  );
}

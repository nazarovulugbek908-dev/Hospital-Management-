import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, Briefcase, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Avatar, Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export function DoctorCard({ doctor, onBook }) {
  const { t } = useLanguage();

  return (
    <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        {/* Header: Photo & Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            <Avatar
              src={doctor.avatar}
              name={doctor.name}
              size="lg"
              className="ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
            </div>
            <span className="text-[10px] text-slate-400">({doctor.reviewsCount || 48} {t('reviews')})</span>
          </div>
        </div>

        {/* Doctor Name & Specialty */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {doctor.specialization || doctor.department}
          </p>
          <span className="inline-block mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {doctor.department}
          </span>
        </div>

        {/* Meta details */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-semibold">{doctor.experience}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{doctor.availability || t('availableToday')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Link
          to={`/patient/doctors/${doctor.id}`}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold text-center transition-colors"
        >
          {t('viewProfile')}
        </Link>

        {onBook ? (
          <Button
            variant="primary"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onBook(doctor)}
          >
            {t('bookAppointment')}
          </Button>
        ) : (
          <Link
            to={`/patient/book-appointment?doctor=${doctor.id}`}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-1"
          >
            <span>{t('bookAppointment')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

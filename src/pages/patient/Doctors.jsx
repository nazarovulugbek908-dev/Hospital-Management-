import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  UserCheck,
  Star,
  Award,
  Stethoscope,
  Briefcase,
  CalendarCheck,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { departmentsList } from '../../data/mockData.js';
import { DoctorCard } from '../../components/doctors/DoctorCard.jsx';
import { Select } from '../../components/common/Input.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export function Doctors() {
  const { doctors } = useHospital();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');

  const specializations = Array.from(new Set(doctors.map(d => d.specialization)));

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.specialization && doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.biography && doc.biography.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesSpec = selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;
    const matchesAvail = selectedAvailability === 'All' || doc.availability === selectedAvailability;
    
    let matchesExp = true;
    if (selectedExp === '5+') matchesExp = doc.experienceYears >= 5;
    if (selectedExp === '8+') matchesExp = doc.experienceYears >= 8;
    if (selectedExp === '10+') matchesExp = doc.experienceYears >= 10;

    return matchesSearch && matchesDept && matchesSpec && matchesAvail && matchesExp;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <UserCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>{t('findRightDoctor')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('doctorSearchSubtitle')}
        </p>
      </div>

      {/* Search & Multi-Filters Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
          />
        </div>

        {/* 4 Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <Select
            label={t('department')}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">{t('allDepartments')}</option>
            {departmentsList.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>

          <Select
            label={t('specialization')}
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="All">{t('allSpecialties')}</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </Select>

          <Select
            label={t('availability')}
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            options={[
              { value: 'All', label: t('allAvailability') },
              { value: 'Available Today', label: t('availableToday') },
              { value: 'Available Tomorrow', label: t('availableTomorrow') }
            ]}
          />

          <Select
            label={t('experience')}
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
            options={[
              { value: 'All', label: t('anyExperience') },
              { value: '5+', label: t('exp5') },
              { value: '8+', label: t('exp8') },
              { value: '10+', label: t('exp10') }
            ]}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          {t('showingDoctors')} <strong className="text-slate-800 dark:text-slate-200">{filteredDoctors.length}</strong> {t('accreditedPhysicians')}
        </span>
        {(searchQuery || selectedDept !== 'All' || selectedSpecialty !== 'All' || selectedAvailability !== 'All' || selectedExp !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All');
              setSelectedSpecialty('All');
              setSelectedAvailability('All');
              setSelectedExp('All');
            }}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            {t('resetFilters')}
          </button>
        )}
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title={t('noDoctorsFound')}
          description={t('noDoctorsDesc')}
          actionLabel={t('clearFilters')}
          onAction={() => {
            setSearchQuery('');
            setSelectedDept('All');
            setSelectedSpecialty('All');
            setSelectedAvailability('All');
            setSelectedExp('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={(doc) => navigate(`/patient/book-appointment?doctor=${doc.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

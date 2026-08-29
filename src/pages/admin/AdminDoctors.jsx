import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Clock,
  Banknote,
  Star,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { departmentsList } from '../../data/mockData.js';
import { Avatar } from '../../components/common/Badge.jsx';
import { AddDoctorModal } from '../../components/admin/AddDoctorModal.jsx';

export function AdminDoctors() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchDept = selectedDepartment === 'All' || doc.department === selectedDepartment;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        doc.name?.toLowerCase().includes(q) ||
        doc.specialization?.toLowerCase().includes(q) ||
        doc.department?.toLowerCase().includes(q) ||
        doc.email?.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });
  }, [doctors, selectedDepartment, searchQuery]);

  const handleOpenAdd = () => {
    setDoctorToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setDoctorToEdit(doc);
    setIsModalOpen(true);
  };

  const handleSaveDoctor = (doctorData) => {
    if (doctorToEdit) {
      updateDoctor(doctorToEdit.id, doctorData);
      showToast(
        lang === 'uz' ? `Shifokor ${doctorData.name} ma‘lumotlari yangilandi.` : 'Doctor profile updated.',
        'success'
      );
    } else {
      addDoctor(doctorData);
      showToast(
        lang === 'uz' ? `Yangi shifokor ${doctorData.name} muvaffaqiyatli qo‘shildi!` : 'New doctor added successfully!',
        'success'
      );
    }
  };

  const handleDeleteDoctor = (id, name) => {
    if (window.confirm(lang === 'uz' ? `Haqiqatan ham ${name}ni ro‘yxatdan o‘chirmoqchimisiz?` : `Remove ${name} from staff?`)) {
      deleteDoctor(id);
      showToast(
        lang === 'uz' ? `${name} ro‘yxatdan o‘chirildi.` : 'Doctor removed.',
        'info'
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('manageDoctors')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'uz'
              ? `Klinikada jami ${doctors.length} nafar faol shifokor mavjud. Yangi mutaxassislarni qo‘shing yoki tahrirlang.`
              : `Total ${doctors.length} active doctors on duty. Add new specialists or manage clinical profiles.`}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addDoctor')}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchDoctors')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDepartment('All')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedDepartment === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {t('allDepartments')} ({doctors.length})
          </button>
          {departmentsList.map((dept) => {
            const count = doctors.filter((d) => d.department === dept).length;
            if (count === 0) return null;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedDepartment === dept
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('noDoctorsFound')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t('noDoctorsDesc')}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            {t('addDoctor')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                {/* Doctor Info Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar src={doc.avatar} alt={doc.name} size="lg" />
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                        {doc.specialization}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        {doc.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold flex-shrink-0">
                    {doc.reviewsCount > 0 && doc.rating > 0 ? (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                        {lang === 'uz' ? 'Yangi' : lang === 'ru' ? 'Новый' : 'New'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badges & Meta */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Award className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doc.experience || `${doc.experienceYears || 5} yrs exp`}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate justify-end font-bold text-slate-900 dark:text-white">
                    <Banknote className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{doc.fee || '150 000 so‘m'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate col-span-2 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doc.workingHours || '09:00 AM - 05:00 PM'}</span>
                  </div>
                </div>

                {/* Available Days Badges */}
                {doc.availableDays && doc.availableDays.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.availableDays.map((day) => (
                      <span
                        key={day}
                        className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold"
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  {doc.phone && (
                    <a
                      href={`tel:${doc.phone}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      title={doc.phone}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {doc.email && (
                    <a
                      href={`mailto:${doc.email}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      title={doc.email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(doc)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{t('edit')}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1 text-xs font-bold"
                    title={t('delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDoctor}
        doctorToEdit={doctorToEdit}
      />

    </div>
  );
}

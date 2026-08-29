import React, { useState, useEffect } from 'react';
import { X, Stethoscope, User, Mail, Phone, Clock, Banknote, Award, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { departmentsList } from '../../data/mockData.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function AddDoctorModal({ isOpen, onClose, onSave, doctorToEdit = null }) {
  const { t, lang } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    department: 'Cardiology',
    specialization: '',
    experienceYears: 5,
    email: '',
    phone: '',
    fee: '150 000 so‘m',
    workingHours: '09:00 AM - 05:00 PM',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    education: '',
    biography: '',
    avatar: '',
    gender: 'Male'
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (doctorToEdit) {
      setFormData({
        name: doctorToEdit.name || '',
        department: doctorToEdit.department || 'Cardiology',
        specialization: doctorToEdit.specialization || '',
        experienceYears: doctorToEdit.experienceYears || 5,
        email: doctorToEdit.email || '',
        phone: doctorToEdit.phone || '',
        fee: doctorToEdit.fee || '150 000 so‘m',
        workingHours: doctorToEdit.workingHours || '09:00 AM - 05:00 PM',
        availableDays: doctorToEdit.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        education: doctorToEdit.education || '',
        biography: doctorToEdit.biography || '',
        avatar: doctorToEdit.avatar || '',
        gender: doctorToEdit.gender || 'Male'
      });
    } else {
      setFormData({
        name: '',
        department: 'Cardiology',
        specialization: '',
        experienceYears: 5,
        email: '',
        phone: '',
        fee: '150 000 so‘m',
        workingHours: '09:00 AM - 05:00 PM',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        education: '',
        biography: '',
        avatar: '',
        gender: 'Male'
      });
    }
    setError('');
  }, [doctorToEdit, isOpen]);

  if (!isOpen) return null;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    setFormData(prev => {
      const exists = prev.availableDays.includes(day);
      if (exists) {
        return { ...prev, availableDays: prev.availableDays.filter(d => d !== day) };
      } else {
        return { ...prev, availableDays: [...prev.availableDays, day] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(lang === 'uz' ? 'Iltimos, shifokor ismini kiriting.' : 'Please enter doctor name.');
      return;
    }
    if (!formData.specialization.trim()) {
      setError(lang === 'uz' ? 'Iltimos, mutaxassislikni kiriting.' : 'Please enter specialization.');
      return;
    }

    const payload = {
      ...formData,
      name: formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`,
      experience: `${formData.experienceYears} ${lang === 'uz' ? 'yil tajriba' : 'years experience'}`,
      avatar: formData.avatar.trim() || ''
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {doctorToEdit ? t('editDoctor') : t('addDoctor')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'uz' ? 'Yangi mutaxassis shifokor profilini to‘ldiring' : 'Fill in specialist doctor details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('doctorName')} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('gender')}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Male">{lang === 'uz' ? 'Erkak (Male)' : 'Male'}</option>
                <option value="Female">{lang === 'uz' ? 'Ayol (Female)' : 'Female'}</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('department')} *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {departmentsList.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('specialization')} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Cardiologist"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'uz' ? 'Tajriba (yillar)' : 'Experience (years)'}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('consultationFee')}
              </label>
              <div className="relative">
                <Banknote className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="masalan: 150 000 so‘m"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="doctor@medicare.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('phoneNumber')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('workingHours')}
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. 09:00 AM - 05:00 PM"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Available Days */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('availableDays')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {daysOfWeek.map(day => {
                const isSelected = formData.availableDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Avatar URL (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {lang === 'uz' ? 'Rasm havolasi (URL - ixtiyoriy)' : 'Photo URL (Optional)'}
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('educationDegree')}
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. MD, Harvard Medical School • Fellow of Cardiology"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('biography')}
            </label>
            <textarea
              rows="3"
              placeholder={lang === 'uz' ? 'Shifokor haqida qisqacha ma‘lumot va tajriba...' : 'Brief summary of clinical background...'}
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{doctorToEdit ? t('saveChanges') : t('addDoctor')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

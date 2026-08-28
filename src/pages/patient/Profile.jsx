import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  ShieldCheck,
  Edit3,
  Check,
  HeartPulse,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input, Select } from '../../components/common/Input.jsx';
import { Avatar, Badge } from '../../components/common/Badge.jsx';

export function Profile() {
  const { patient, updateProfile } = useAuth();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    dateOfBirth: patient?.dateOfBirth || '',
    gender: patient?.gender || 'Male',
    address: patient?.address || '',
    bloodGroup: patient?.bloodGroup || 'O+',
    emergencyContact: patient?.emergencyContact || '',
    bio: patient?.bio || '',
    avatar: patient?.avatar || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showToast(lang === 'uz' ? 'Profil muvaffaqiyatli saqlandi.' : 'Profile updated successfully.', 'success');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: patient?.name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      dateOfBirth: patient?.dateOfBirth || '',
      gender: patient?.gender || 'Male',
      address: patient?.address || '',
      bloodGroup: patient?.bloodGroup || 'O+',
      emergencyContact: patient?.emergencyContact || '',
      bio: patient?.bio || '',
      avatar: patient?.avatar || ''
    });
    setIsEditing(false);
  };

  if (!patient) return null;

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <Avatar
            src={patient.avatar}
            name={patient.name}
            size="xl"
            className="ring-4 ring-white/30 shadow-2xl"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {patient.name}
              </h1>
              <Badge variant="primary" className="bg-white/20 text-white border-white/30">
                {t('patientMember')}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              {patient.bio || 'Active patient prioritizing cardiovascular wellness and preventative checkups.'}
            </p>

            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-blue-100">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {patient.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {patient.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" />
                {patient.bloodGroup || 'O+'}
              </span>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              icon={isEditing ? X : Edit3}
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 shadow-sm"
            >
              {isEditing ? t('cancel') : t('editProfile')}
            </Button>
          </div>
        </div>
      </div>

      {/* Details Form / View */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('personalInfo')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personal contact details and vital health baseline information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('fullName')}
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label={t('emailAddress')}
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label={t('phoneNumber')}
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label={t('homeAddress')}
              value={formData.address}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <Input
              label={t('dateOfBirth')}
              type="date"
              value={formData.dateOfBirth}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />

            <Select
              label={t('gender')}
              value={formData.gender}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Male', label: 'Male / Erkak / Мужской' },
                { value: 'Female', label: 'Female / Ayol / Женский' },
                { value: 'Other', label: 'Other / Boshqa' }
              ]}
            />

            <Select
              label={t('bloodGroup')}
              value={formData.bloodGroup}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' }
              ]}
            />

            <Input
              label={t('emergencyContact')}
              value={formData.emergencyContact}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={handleCancel}>
                {t('cancel')}
              </Button>
              <Button type="submit" variant="primary" icon={Save}>
                {t('saveChanges')}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

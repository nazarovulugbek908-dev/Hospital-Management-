import React, { useState, useRef } from 'react';
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
  X,
  Camera,
  Trash2,
  Upload
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
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
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

  React.useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || 'Male',
        address: patient.address || '',
        bloodGroup: patient.bloodGroup || 'O+',
        emergencyContact: patient.emergencyContact || '',
        bio: patient.bio || '',
        avatar: patient.avatar || ''
      });
    }
  }, [patient]);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast(lang === 'uz' ? 'Rasm hajmi 2MB dan oshmasligi kerak.' : 'Image size must be less than 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      setFormData(prev => ({ ...prev, avatar: base64Data }));
      showToast(lang === 'uz' ? 'Rasm tanlandi. Saqlash uchun "O‘zgarishlarni saqlash" tugmasini bosing.' : 'Image selected. Click "Save Changes" to apply.', 'info');
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    try {
      await updateProfile({ avatar: '' });
      showToast(lang === 'uz' ? 'Profil rasmi olib tashlandi.' : 'Profile photo removed.', 'info');
    } catch (e) {
      showToast('Failed to remove photo.', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      showToast(lang === 'uz' ? 'Profil muvaffaqiyatli saqlandi.' : 'Profile updated successfully.', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
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
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Upload Control */}
          <div className="relative group">
            <Avatar
              src={formData.avatar || patient.avatar}
              name={formData.name || patient.name}
              size="xl"
              className="ring-4 ring-white/30 shadow-2xl"
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex items-center gap-1.5 mt-2.5 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-bold transition-all flex items-center gap-1 border border-white/30 shadow-sm"
                title={lang === 'uz' ? 'Rasm yuklash' : 'Upload photo'}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{formData.avatar ? (lang === 'uz' ? 'O‘zgartirish' : 'Change') : (lang === 'uz' ? 'Rasm qo‘yish' : 'Add Photo')}</span>
              </button>

              {formData.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="p-1 rounded-xl bg-white/20 hover:bg-rose-600/80 backdrop-blur-md text-white text-[11px] font-bold transition-all border border-white/30"
                  title={lang === 'uz' ? 'Rasmni o‘chirish' : 'Remove photo'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

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
              {patient.bio || (lang === 'uz' ? 'MediCare ro‘yxatdan o‘tgan bemor aʼzosi.' : 'MediCare verified patient member.')}
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
              {lang === 'uz' ? 'Shaxsiy aloqa maʼlumotlari va salomatlik profili.' : 'Personal contact details and vital health baseline information.'}
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
              disabled
              helperText="Managed via Supabase Auth"
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
                { value: 'Male', label: lang === 'uz' ? 'Erkak' : 'Male' },
                { value: 'Female', label: lang === 'uz' ? 'Ayol' : 'Female' },
                { value: 'Other', label: lang === 'uz' ? 'Boshqa' : 'Other' }
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

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'uz' ? 'Bio / Salomatlik tavsifi' : 'Bio / Health Summary'}
            </label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder={lang === 'uz' ? 'Salomatlik haqida qisqacha ma‘lumot...' : 'Brief health notes or bio...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                {t('cancel')}
              </Button>
              <Button type="submit" variant="primary" icon={Save} loading={saving}>
                {t('saveChanges')}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

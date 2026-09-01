import React, { useState, useEffect, useRef } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Save,
  Sun,
  Moon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  HeartPulse,
  Camera,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input, Select } from '../../components/common/Input.jsx';
import { Avatar } from '../../components/common/Badge.jsx';

export function Settings() {
  const { patient, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'notifications' | 'preferences'
  const [savingAccount, setSavingAccount] = useState(false);

  const fileInputRef = useRef(null);

  // Account form
  const [accountData, setAccountData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    address: patient?.address || '',
    dateOfBirth: patient?.dateOfBirth || '',
    gender: patient?.gender || 'Male',
    bloodGroup: patient?.bloodGroup || 'O+',
    emergencyContact: patient?.emergencyContact || '',
    bio: patient?.bio || '',
    avatar: patient?.avatar || ''
  });

  useEffect(() => {
    if (patient) {
      setAccountData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        address: patient.address || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || 'Male',
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
      setAccountData(prev => ({ ...prev, avatar: base64Data }));
      showToast(lang === 'uz' ? 'Rasm tanlandi. Saqlash uchun "Saqlash" tugmasini bosing.' : 'Image selected. Click "Save Information" to apply.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    setAccountData(prev => ({ ...prev, avatar: '' }));
    try {
      await updateProfile({ avatar: '' });
      showToast(lang === 'uz' ? 'Profil rasmi olib tashlandi.' : 'Profile photo removed.', 'info');
    } catch (e) {
      showToast('Failed to remove photo.', 'error');
    }
  };

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    smsAlerts: false,
    labResults: true
  });

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      await updateProfile(accountData);
      showToast(lang === 'uz' ? 'Shaxsiy maʼlumotlar saqlandi.' : 'Personal information updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    showToast(lang === 'uz' ? 'Bildirishnoma sozlamalari saqlandi.' : 'Notification settings saved.', 'success');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast(lang === 'uz' ? 'Tizim sozlamalari saqlandi.' : 'System preferences saved.', 'success');
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>{t('settings')}</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {lang === 'uz'
            ? 'Shaxsiy hisob, bildirishnomalar va ko‘rinish sozlamalarini boshqaring.'
            : lang === 'ru'
            ? 'Управляйте личным профилем, уведомлениями и настройками интерфейса.'
            : 'Manage your personal profile, notification alerts, and appearance preferences.'}
        </p>
      </div>

      {/* Tabs - Security tab completely removed */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 no-scrollbar">
        {[
          { id: 'account', label: t('personalInfo'), icon: User },
          { id: 'notifications', label: t('notifications'), icon: Bell },
          { id: 'preferences', label: t('preferences'), icon: Palette }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Account / Personal Info */}
      {activeTab === 'account' && (
        <form
          onSubmit={handleSaveAccount}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('personalInfo')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'uz' ? 'Shaxsiy maʼlumotlar, profil rasmi va aloqa manzilingizni yangilang.' : 'Update your personal profile photo, details, and contact address.'}
            </p>
          </div>

          {/* Avatar Profile Photo Upload */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <Avatar
              src={accountData.avatar || patient?.avatar}
              name={accountData.name || patient?.name}
              size="lg"
              className="ring-2 ring-blue-500/30 shadow-md"
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {lang === 'uz' ? 'Profil rasmi' : 'Profile Photo'}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'uz' ? 'PNG, JPG yoki WebP (maks. 2MB)' : 'PNG, JPG or WebP (max. 2MB)'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{accountData.avatar ? (lang === 'uz' ? 'O‘zgartirish' : 'Change Photo') : (lang === 'uz' ? 'Rasm yuklash' : 'Upload Photo')}</span>
                </button>

                {accountData.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'uz' ? 'O‘chirish' : 'Remove'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('fullName')}
              icon={User}
              value={accountData.name}
              onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
              required
            />
            <Input
              label={t('emailAddress')}
              icon={Mail}
              type="email"
              value={accountData.email}
              disabled
              helperText="Email is managed via Supabase Auth"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('phoneNumber')}
              icon={Phone}
              value={accountData.phone}
              onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
              placeholder="+998 (90) 123-45-67"
            />
            <Input
              label={t('homeAddress')}
              icon={MapPin}
              value={accountData.address}
              onChange={(e) => setAccountData({ ...accountData, address: e.target.value })}
              placeholder={lang === 'uz' ? 'Toshkent sh., Yunusobod tumani' : 'Tashkent, Uzbekistan'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t('dateOfBirth')}
              icon={Calendar}
              type="date"
              value={accountData.dateOfBirth}
              onChange={(e) => setAccountData({ ...accountData, dateOfBirth: e.target.value })}
            />
            <Select
              label={t('gender')}
              icon={User}
              value={accountData.gender}
              onChange={(e) => setAccountData({ ...accountData, gender: e.target.value })}
              options={[
                { value: 'Male', label: lang === 'uz' ? 'Erkak' : 'Male' },
                { value: 'Female', label: lang === 'uz' ? 'Ayol' : 'Female' },
                { value: 'Other', label: lang === 'uz' ? 'Boshqa' : 'Other' }
              ]}
            />
            <Select
              label={t('bloodGroup')}
              icon={HeartPulse}
              value={accountData.bloodGroup}
              onChange={(e) => setAccountData({ ...accountData, bloodGroup: e.target.value })}
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {lang === 'uz' ? 'Bio / Salomatlik haqida qisqacha' : 'Bio / Health Summary'}
            </label>
            <textarea
              rows={3}
              value={accountData.bio}
              onChange={(e) => setAccountData({ ...accountData, bio: e.target.value })}
              placeholder={lang === 'uz' ? 'Salomatlik haqida qisqacha ma‘lumot...' : 'Brief health notes or bio...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={Save} loading={savingAccount}>
              {t('saveInfo')}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: Notifications */}
      {activeTab === 'notifications' && (
        <form
          onSubmit={handleSaveNotifications}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('notifications')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'uz' ? 'Qanday xabarlarni olishingizni sozlang.' : 'Configure your notification alerts and medical reminders.'}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'emailNotifications',
                title: lang === 'uz' ? 'Email Bildirishnomalar' : lang === 'ru' ? 'Email Уведомления' : 'Email Notifications',
                desc: lang === 'uz' ? 'Qabul tasdiqlari va hisobotlarni emailingizga yuborish' : 'Receive appointment confirmations and medical summaries via email.'
              },
              {
                id: 'appointmentReminders',
                title: lang === 'uz' ? 'Qabul Eslatmalari' : lang === 'ru' ? 'Напоминания о приеме' : 'Appointment Reminders',
                desc: lang === 'uz' ? 'Konsultatsiyadan 24 soat oldin avtomatik eslatish' : 'Get automated reminders 24 hours prior to scheduled visits.'
              },
              {
                id: 'smsAlerts',
                title: lang === 'uz' ? 'SMS Xabarlar' : lang === 'ru' ? 'SMS Оповещения' : 'SMS Alerts',
                desc: lang === 'uz' ? 'Favqulodda xabarlar va tezkor o‘zgarishlar' : 'Emergency schedule updates and doctor availability alerts via SMS.'
              },
              {
                id: 'labResults',
                title: lang === 'uz' ? 'Tahlil va Tibbiy Natijalar' : lang === 'ru' ? 'Результаты анализов' : 'Diagnostic & Lab Alerts',
                desc: lang === 'uz' ? 'Yangi tashxis va retseptlar yuklanganda xabar berish' : 'Instant alerts when new medical test results are uploaded.'
              }
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifSettings[item.id]}
                  onChange={(e) => setNotifSettings({ ...notifSettings, [item.id]: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={Save}>
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: Preferences */}
      {activeTab === 'preferences' && (
        <form
          onSubmit={handleSavePreferences}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('preferences')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'uz' ? 'Dastur tili va ranglar mavzusini tanlang.' : 'Customize portal interface language and color mode.'}
            </p>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('interfaceTheme')}
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2.5 transition-all ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-bold">{t('lightMode')}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2.5 transition-all ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-6 h-6 text-sky-400" />
                <span className="text-xs font-bold">{t('darkMode')}</span>
              </button>
            </div>
          </div>

          <div className="max-w-md pt-2">
            <Select
              label={t('preferredLanguage')}
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              options={[
                { value: 'uz', label: '🇺🇿 O‘zbekcha' },
                { value: 'ru', label: '🇷🇺 Русский' },
                { value: 'en', label: '🇬🇧 English' }
              ]}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={Save}>
              {t('savePreferences')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

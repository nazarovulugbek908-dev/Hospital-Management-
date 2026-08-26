import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Palette,
  Save,
  ShieldCheck,
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input, Select } from '../../components/common/Input.jsx';

export function Settings() {
  const { patient, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'security' | 'notifications' | 'preferences'

  // Account form
  const [accountData, setAccountData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    address: patient?.address || ''
  });

  // Password form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passError, setPassError] = useState('');

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    smsAlerts: false,
    labResults: true
  });

  const handleSaveAccount = (e) => {
    e.preventDefault();
    updateProfile(accountData);
    showToast(lang === 'uz' ? 'Shaxsiy maʼlumotlar saqlandi.' : 'Personal information updated.', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassError('');

    if (!passwords.currentPassword) {
      setPassError(lang === 'uz' ? 'Amaldagi parolni kiriting.' : 'Current password is required.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPassError(lang === 'uz' ? 'Yangi parol kamida 6 belgidan iborat bo‘lishi kerak.' : 'New password must be at least 6 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassError(lang === 'uz' ? 'Yangi parollar bir-biriga mos kelmadi.' : 'New passwords do not match.');
      return;
    }

    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast(lang === 'uz' ? 'Parol muvaffaqiyatli yangilandi.' : 'Password updated successfully.', 'success');
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
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>{t('settings')}</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {lang === 'uz'
            ? 'Shaxsiy hisob, xavfsizlik, bildirishnomalar va ko‘rinish sozlamalarini boshqaring.'
            : lang === 'ru'
            ? 'Управляйте личным кабинетом, безопасностью, уведомлениями и настройками интерфейса.'
            : 'Manage your personal account, security credentials, notification alerts, and appearance preferences.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 no-scrollbar">
        {[
          { id: 'account', label: t('personalInfo'), icon: User },
          { id: 'security', label: t('security'), icon: Lock },
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

      {/* TAB 1: Account */}
      {activeTab === 'account' && (
        <form
          onSubmit={handleSaveAccount}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('personalInfo')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'uz' ? 'Aloqa maʼlumotlari va yashash manzilingizni yangilang.' : 'Update your contact credentials and home address.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('fullName')}
              value={accountData.name}
              onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
              required
            />
            <Input
              label={t('emailAddress')}
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('phoneNumber')}
              value={accountData.phone}
              onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
            />
            <Input
              label={t('homeAddress')}
              value={accountData.address}
              onChange={(e) => setAccountData({ ...accountData, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={Save}>
              {t('saveInfo')}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: Security */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleChangePassword}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('security')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'uz' ? 'Hisobingiz xavfsizligini taʼminlash uchun kuchli paroldan foydalaning.' : 'Ensure your account is using a strong, unique password.'}
            </p>
          </div>

          {passError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {passError}
            </div>
          )}

          <div className="max-w-md space-y-4">
            <Input
              label={t('currentPassword')}
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Input
              label={t('newPassword')}
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Input
              label={t('confirmNewPassword')}
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={Save}>
              {t('updatePassword')}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: Notifications */}
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

      {/* TAB 4: Preferences */}
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

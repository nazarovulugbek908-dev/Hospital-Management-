import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  UserPlus,
  HeartPulse,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input, Select } from '../../components/common/Input.jsx';
import { Logo } from '../../components/common/Logo.jsx';

export function Register() {
  const { register, loading } = useAuth();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError(lang === 'uz' ? 'Iltimos, to‘liq ismingizni kiriting.' : 'Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError(lang === 'uz' ? 'Iltimos, email manzilingizni kiriting.' : 'Please enter your email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError(lang === 'uz' ? 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak.' : 'Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(lang === 'uz' ? 'Parollar bir-biriga mos kelmadi.' : 'Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setError(lang === 'uz' ? 'Foydalanish shartlariga rozilik bildiring.' : 'You must agree to the Terms of Service.');
      return;
    }

    try {
      await register(formData);
      showToast(lang === 'uz' ? 'Bemor hisobingiz muvaffaqiyatli yaratildi! 🎉' : 'Patient account created successfully! 🎉', 'success');
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.message || (lang === 'uz' ? 'Ro‘yxatdan o‘tishda xatolik yuz berdi.' : 'Failed to create patient account.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl space-y-6 relative z-10 animate-fadeIn">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center">
            <Logo size="lg" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {lang === 'uz' ? 'Bemor sifatida ro‘yxatdan o‘tish' : lang === 'ru' ? 'Регистрация пациента' : 'Patient Registration'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {lang === 'uz'
              ? 'Shifokorlar qabuliga yozilish va tibbiy tarixingizni kuzatish uchun hisob yarating.'
              : lang === 'ru'
              ? 'Создайте аккаунт для быстрой записи к врачам и просмотра карты.'
              : 'Create your personal healthcare account to find doctors and book consultations.'}
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-slideDown">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={lang === 'uz' ? 'To‘liq Ismingiz' : lang === 'ru' ? 'Полное имя' : 'Full Name'}
              placeholder={lang === 'uz' ? 'Masalan: Jamshid Aliyev' : 'e.g. John Williams'}
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('emailAddress') || (lang === 'uz' ? 'Email Manzil' : 'Email Address')}
                type="email"
                placeholder="patient@example.com"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label={t('phoneNumber') || (lang === 'uz' ? 'Telefon Raqami' : 'Phone Number')}
                type="tel"
                placeholder="+998 (90) 123-45-67"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={lang === 'uz' ? 'Tug‘ilgan sana' : lang === 'ru' ? 'Дата рождения' : 'Date of Birth'}
                type="date"
                icon={Calendar}
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />

              <Select
                label={lang === 'uz' ? 'Jinsi' : lang === 'ru' ? 'Пол' : 'Gender'}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                options={[
                  { value: 'Male', label: lang === 'uz' ? 'Erkak' : lang === 'ru' ? 'Мужской' : 'Male' },
                  { value: 'Female', label: lang === 'uz' ? 'Ayol' : lang === 'ru' ? 'Женский' : 'Female' },
                  { value: 'Other', label: lang === 'uz' ? 'Boshqa' : lang === 'ru' ? 'Другой' : 'Other' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={lang === 'uz' ? 'Parol' : lang === 'ru' ? 'Пароль' : 'Password'}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Input
                label={lang === 'uz' ? 'Parolni tasdiqlang' : lang === 'ru' ? 'Подтвердите пароль' : 'Confirm Password'}
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20"
              />
              <span>
                {lang === 'uz' ? (
                  <>
                    Men <span className="text-blue-600 dark:text-blue-400 font-semibold">MediCare Xizmat ko‘rsatish qoidalari</span>ga roziman.
                  </>
                ) : (
                  <>
                    I agree to the <span className="text-blue-600 dark:text-blue-400 font-semibold">MediCare Terms of Service</span>.
                  </>
                )}
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={UserPlus}
            >
              {lang === 'uz' ? 'Ro‘yxatdan o‘tish' : lang === 'ru' ? 'Создать аккаунт' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'uz' ? 'Hisobingiz bormi?' : lang === 'ru' ? 'Уже есть аккаунт?' : 'Already have an account?'}{' '}
              <Link
                to="/login"
                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
              >
                {lang === 'uz' ? 'Tizimga Kirish' : lang === 'ru' ? 'Войти' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

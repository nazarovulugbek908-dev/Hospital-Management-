import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Logo } from '../../components/common/Logo.jsx';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`
        });
      }
    } catch (err) {
      console.warn('Supabase reset password note:', err);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading(false);
    setSubmitted(true);
    showToast(
      lang === 'uz'
        ? 'Parolni tiklash havolasi emailingizga yuborildi.'
        : lang === 'ru'
        ? 'Инструкция по восстановлению пароля отправлена на email.'
        : 'Password reset instructions sent to your email.',
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      <div className="w-full max-w-md space-y-6 relative z-10 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center">
            <Logo size="lg" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {lang === 'uz' ? 'Parolni Tiklash' : lang === 'ru' ? 'Восстановление Пароля' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'uz'
              ? 'Parolni qayta tiklash bo‘yicha ko‘rsatma olish uchun ro‘yxatdan o‘tgan emailingizni kiriting.'
              : lang === 'ru'
              ? 'Введите email, указанный при регистрации, чтобы получить ссылку для сброса пароля.'
              : 'Enter your patient registered email to receive password recovery instructions.'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
          {submitted ? (
            <div className="text-center space-y-4 py-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'uz' ? 'Havola Yuborildi 🎉' : lang === 'ru' ? 'Ссылка Отправлена 🎉' : 'Reset Link Sent 🎉'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang === 'uz'
                    ? <>Parolni tiklash bo‘yicha ko‘rsatmalar <strong className="text-slate-800 dark:text-slate-200">{email}</strong> manziliga yuborildi.</>
                    : lang === 'ru'
                    ? <>Инструкции по восстановлению пароля отправлены на <strong className="text-slate-800 dark:text-slate-200">{email}</strong>.</>
                    : <>We've sent password reset instructions to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>.</>}
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'uz' ? 'Kirish sahifasiga qaytish' : lang === 'ru' ? 'Вернуться к входу' : 'Return to Sign In'}</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('emailAddress') || 'Email Address'}
                type="email"
                placeholder="patient@hospital.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                loading={loading}
                icon={Send}
              >
                {lang === 'uz' ? 'Tiklash Havolasini Yuborish' : lang === 'ru' ? 'Отправить Ссылку' : 'Send Reset Link'}
              </Button>

              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'uz' ? 'Kirish sahifasiga qaytish' : lang === 'ru' ? 'Назад ко входу' : 'Back to Login'}</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

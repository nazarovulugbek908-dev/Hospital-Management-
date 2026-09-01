import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  HeartPulse,
  CheckCircle2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Logo } from '../../components/common/Logo.jsx';

export function Login() {
  const { login, loading, isAuthenticated, role, patient } = useAuth();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/patient/dashboard';

  useEffect(() => {
    if (isAuthenticated && patient) {
      if (patient.role === 'admin' || role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, patient, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(lang === 'uz' ? 'Iltimos, email manzilingizni kiriting.' : 'Please enter your email address.');
      return;
    }
    if (!password) {
      setError(lang === 'uz' ? 'Iltimos, parolingizni kiriting.' : 'Please enter your password.');
      return;
    }

    try {
      const res = await login(email, password);
      showToast(lang === 'uz' ? `Xush kelibsiz, ${res.patient.name}!` : `Welcome back, ${res.patient.name}!`, 'success');
      const isAdminUser = res.role === 'admin' || res.patient?.role === 'admin' || email.toLowerCase().includes('admin');
      if (isAdminUser) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from === '/login' ? '/patient/dashboard' : from, { replace: true });
      }
    } catch (err) {
      setError(err.message || (lang === 'uz' ? 'Email yoki parol noto‘g‘ri.' : 'Invalid email or password.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Left Split Screen: Healthcare Highlights */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white p-12 flex-col justify-between overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-blue-900/20 pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center">
            <Logo size="lg" whiteText={true} />
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-100 border border-white/20">
            <HeartPulse className="w-4 h-4 text-emerald-300" />
            <span>Dedicated Patient Portal</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Your Health Journey, Simplified in One Place.
          </h1>

          <p className="text-sm text-blue-100/90 leading-relaxed">
            Schedule specialized doctor appointments, review diagnosis timelines, and stay on top of personal healthcare tasks.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/20 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Direct access to accredited clinical specialists</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Real-time appointment calendar & instant booking</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Secure personal health history & consultation records</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-100/80">
          © 2026 MediCare Healthcare System.
        </div>
      </div>

      {/* Right Split Screen: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md space-y-6 animate-fadeIn">
          {/* Brand header on mobile */}
          <div className="lg:hidden text-center pb-2">
            <Link to="/" className="inline-flex items-center justify-center">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Sign in with your email and password to access your portal.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-slideDown">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('emailAddress') || 'Email Address'}
              type="email"
              placeholder="admin@gmail.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20"
                />
                <span>{lang === 'uz' ? 'Eslab qolish' : lang === 'ru' ? 'Запомнить меня' : 'Remember me'}</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
              >
                {lang === 'uz' ? 'Parolni unutdingizmi?' : lang === 'ru' ? 'Забыли пароль?' : 'Forgot password?'}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={LogIn}
            >
              {lang === 'uz' ? 'Tizimga Kirish' : lang === 'ru' ? 'Войти в систему' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'uz' ? 'Hisobingiz yo‘qmi?' : lang === 'ru' ? 'Нет аккаунта?' : "Don't have an account?"}{' '}
              <Link
                to="/register"
                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
              >
                {lang === 'uz' ? 'Ro‘yxatdan o‘tish' : lang === 'ru' ? 'Зарегистрироваться' : 'Create Account'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

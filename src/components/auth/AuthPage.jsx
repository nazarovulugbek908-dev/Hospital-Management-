// Auth Page Component - Hospital Management System (Login + Register + Multilingual)

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../common/ToastContainer.jsx';
import { LanguageSelector } from '../common/LanguageSelector.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Building2,
  Award,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Sparkles,
  HeartPulse,
  UserPlus
} from 'lucide-react';

export function AuthPage({ onAuthSuccess }) {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('patient'); // 'patient', 'doctor', 'admin'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [department, setDepartment] = useState('Cardiovascular Care');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [rememberMe, setRememberMe] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Forgot password modal
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Pre-fill demo accounts for fast testing
  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    setMode('login');
    setError(null);
    if (targetRole === 'admin') {
      setEmail('admin@hospital.org');
      setPassword('admin123');
    } else if (targetRole === 'doctor') {
      setEmail('sarah.jenkins@hospital.org');
      setPassword('doctor123');
    } else {
      setEmail('eleanor.vance@gmail.com');
      setPassword('patient123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error(t('fillRequiredFields'));
        }
        const user = await login(email, password);
        showToast(`${t('welcome')}, ${user.name}!`, 'success');
        if (onAuthSuccess) onAuthSuccess(user);
      } else {
        // Registration
        if (!email || !password || !fullName) {
          throw new Error(t('fillRequiredFields'));
        }
        if (password !== confirmPassword) {
          throw new Error(t('passwordsDoNotMatch'));
        }
        const user = await register({
          role,
          email,
          password,
          fullName,
          phone,
          specialization,
          department,
          age,
          gender,
          bloodGroup
        });
        showToast(t('bookingSuccess'), 'success');
        if (onAuthSuccess) onAuthSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      showToast(t('resetSuccessMsg'), 'success');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative font-sans overflow-x-hidden selection:bg-sky-500 selection:text-slate-950">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDE: Healthcare Visual Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 lg:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 relative overflow-hidden">
        {/* Subtle Overlay Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                MedPulse <span className="text-sky-400 font-medium text-xs px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">Care</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">{t('systemTagline')}</p>
            </div>
          </div>
        </div>

        {/* Middle Visual Presentation */}
        <div className="relative z-10 my-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Healthcare Management SaaS</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Seamless Patient Care & Integrated Hospital Operations
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Manage clinical workflows, doctor availability, appointment bookings, and patient medical histories in one intuitive, multilingual platform.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Patient Health Records</h4>
                <p className="text-[11px] text-slate-400">Encrypted history & prescriptions</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Doctor Roster & Shifts</h4>
                <p className="text-[11px] text-slate-400">Smart consultation schedules</p>
              </div>
            </div>
          </div>

          {/* Quick Fill Credentials Bar */}
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 font-semibold mb-2.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('demoAccountsHint')}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('doctor')}
                className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>Doctor Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('patient')}
                className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Patient Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 border-t border-slate-800/60 text-xs text-slate-500 flex justify-between items-center">
          <span>&copy; 2026 MedPulse Care System. All rights reserved.</span>
          <span className="text-[11px] font-mono text-sky-400/80">v2.4.0 (i18n Enriched)</span>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form & Language Switcher */}
      <div className="w-full md:w-1/2 p-6 lg:p-12 flex flex-col justify-center max-w-xl mx-auto relative">
        {/* Top Bar with Language Selector */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('signInLink')}
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('register')}
            </button>
          </div>

          <LanguageSelector variant="header" />
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'login' ? t('loginTitle') : t('registerTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' ? t('loginSubTitle') : t('registerSubTitle')}
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">{t('roleLabel')}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'patient'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('patient')}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'doctor'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-400 shadow-md shadow-teal-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>{t('doctor')}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'admin'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('admin')}</span>
              </button>
            </div>
          </div>

          {/* Alert Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name for Registration */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">{t('fullNameLabel')} *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">{t('emailLabel')} *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('emailPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            {/* Role Specific Registration Fields */}
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">{t('phoneLabel')}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('phonePlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>

                {role === 'doctor' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">{t('specializationLabel')}</label>
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">{t('departmentLabel')}</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                )}

                {role === 'patient' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-300">{t('ageLabel')}</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-300">{t('genderLabel')}</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-300">{t('bloodGroupLabel')}</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">{t('passwordLabel')} *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('passwordPlaceholder')}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password for Register */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">{t('confirmPasswordLabel')} *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder={t('passwordPlaceholder')}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Options Bar for Login */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 text-sky-500 focus:ring-0 bg-slate-900"
                  />
                  <span>{t('rememberMe')}</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-sky-400 hover:text-sky-300 font-semibold"
                >
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50 transition-all transform active:scale-[0.99] mt-2"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {mode === 'login' ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{mode === 'login' ? `${t('signInLink')} as ${t(role)}` : `${t('register')} as ${t(role)}`}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode Footer */}
          <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            {mode === 'login' ? (
              <p>
                {t('noAccount')}{' '}
                <button
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-sky-400 hover:text-sky-300 font-bold ml-1"
                >
                  {t('signUpLink')}
                </button>
              </p>
            ) : (
              <p>
                {t('haveAccount')}{' '}
                <button
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-sky-400 hover:text-sky-300 font-bold ml-1"
                >
                  {t('signInLink')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t('forgotPasswordTitle')}</h3>
                <p className="text-xs text-slate-400">{t('forgotPasswordDesc')}</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{t('resetSuccessMsg')}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">{t('emailLabel')} *</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="user@hospital.org"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsForgotOpen(false); setForgotSubmitted(false); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400"
                  >
                    {t('sendResetLink')}
                  </button>
                </div>
              </form>
            )}

            {forgotSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setIsForgotOpen(false); setForgotSubmitted(false); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                >
                  {t('close')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

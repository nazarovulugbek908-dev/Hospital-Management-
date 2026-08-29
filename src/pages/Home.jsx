import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  CalendarCheck,
  FileText,
  Bell,
  LayoutDashboard,
  ShieldCheck,
  HeartPulse,
  Star,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useHospital } from '../context/HospitalContext.jsx';
import { DoctorCard } from '../components/doctors/DoctorCard.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Logo, LogoIcon } from '../components/common/Logo.jsx';

export function Home() {
  const { isAuthenticated, patient } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { doctors } = useHospital();

  const features = [
    {
      title: 'Find Doctors',
      desc: 'Search doctors by name, department and specialization with verified ratings and experience.',
      icon: Search,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Discovery'
    },
    {
      title: 'Easy Booking',
      desc: 'Book an appointment in a few simple steps with real-time calendar and available time slots.',
      icon: CalendarCheck,
      color: 'from-sky-500 to-cyan-500',
      badge: '4-Step Wizard'
    },
    {
      title: 'Appointment Management',
      desc: 'Manage upcoming and previous appointments with easy viewing and cancel options.',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Real-time'
    },
    {
      title: 'Medical Records',
      desc: 'View fictional diagnosis, doctor recommendations, vitals metrics, and visit summaries.',
      icon: FileText,
      color: 'from-purple-500 to-violet-500',
      badge: 'Timeline'
    },
    {
      title: 'Notifications',
      desc: 'Receive appointment updates and reminder notifications right in your patient dashboard.',
      icon: Bell,
      color: 'from-amber-500 to-orange-500',
      badge: 'Alerts'
    },
    {
      title: 'Personal Dashboard',
      desc: 'Manage your profile, emergency contacts, to-do productivity tasks, and healthcare activities.',
      icon: LayoutDashboard,
      color: 'from-rose-500 to-pink-500',
      badge: 'Portal'
    }
  ];

  const steps = [
    {
      step: 'Step 1',
      title: 'Find a Doctor',
      desc: 'Filter by specialty, department, and doctor availability across 6 clinical departments.'
    },
    {
      step: 'Step 2',
      title: 'Choose Date & Time',
      desc: 'Select an available appointment date and convenient non-conflicting time slot.'
    },
    {
      step: 'Step 3',
      title: 'Confirm Appointment',
      desc: 'Review consultation details, enter your visit reason, and submit instant booking.'
    },
    {
      step: 'Step 4',
      title: 'Manage Your Appointment',
      desc: 'Track confirmation status, access doctor notes, and receive timely notifications.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-500/30">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <Logo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#doctors" className="hover:text-blue-600 transition-colors">Doctors</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/patient/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all"
              >
                <span>My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/20 to-sky-400/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-sm animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Modern Patient Healthcare Portal</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              Healthcare Management,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
                Simplified.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Find doctors, book appointments and manage your healthcare information from one simple platform.
            </p>
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/patient/doctors"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find a Doctor</span>
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Hero Illustration / Dashboard Preview */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-slate-200/80 to-slate-100/50 dark:from-slate-800/90 dark:to-slate-900/60 border border-slate-300/80 dark:border-slate-700/80 shadow-2xl backdrop-blur-xl">
              <div className="rounded-2xl bg-white dark:bg-slate-950 p-5 sm:p-6 text-left space-y-6">
                {/* Header preview */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    <span className="ml-2 text-xs font-mono text-slate-400">MediCare Patient Portal Preview</span>
                  </div>
                  <Badge variant="success" size="sm" dot>Portal Active</Badge>
                </div>

                {/* Stat cards preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Upcoming</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">3 Visits</h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Completed</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">12 Records</h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Doctors</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">24 Specialists</h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Pending</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">1 Request</h3>
                  </div>
                </div>

                {/* Highlighted Appointment Card Mockup */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-600/20">
                      JS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dr. John Smith</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Cardiology • August 28, 2026 at 10:30 AM</p>
                    </div>
                  </div>
                  <Badge variant="success" size="md" dot>Confirmed</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Care Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Everything You Need for Seamless Healthcare
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Explore the comprehensive suite of patient-centered healthcare tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="group rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Step-by-Step
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Schedule your next medical consultation in 4 effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black text-sm flex items-center justify-center border border-blue-200 dark:border-blue-900/60">
                  {st.step}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Preview */}
      <section id="doctors" className="py-16 sm:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Accredited Specialists
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Top Rated Physicians
              </h2>
            </div>
            <Link
              to="/patient/doctors"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All 24 Doctors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.slice(0, 3).map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* About & Production Architecture */}
      <section id="about" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Supabase Cloud Healthcare Architecture</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise PostgreSQL backend with real-time multi-tab synchronization and Row-Level Security.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Ready for Instant Testing:</span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  Sign in with registered Patient or Admin credentials or create a new account in seconds.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs text-center shadow-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs text-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon size="sm" />
            <span className="font-bold text-slate-800 dark:text-slate-200">MediCare Healthcare Management System</span>
            <span>• Supabase Real-Time Backend</span>
          </div>
          <p>© 2026 MediCare Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Menu,
  CheckSquare,
  FileText,
  Calendar,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Avatar } from '../common/Badge.jsx';

export function Navbar({ onOpenMobileMenu }) {
  const { patient, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useHospital();
  const { lang, setLang, t, languagesList } = useLanguage();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentLangObj = languagesList.find(l => l.code === lang) || languagesList[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/patient/doctors?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Mobile Trigger & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/patient/dashboard" className="flex items-center gap-2.5 group">
            <span className="text-2xl select-none group-hover:scale-105 transition-transform">🏥</span>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Medi<span className="text-blue-600 dark:text-blue-400">Care</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-slate-400 -mt-1 tracking-wider uppercase">
                {t('portalTitle')}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Doctors */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <Search className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'uz' ? "Shifokorlarni ismi, bo'limi bo'yicha qidiring..." : lang === 'ru' ? "Поиск врачей по имени, отделению..." : "Search doctors by name, specialty, department..."}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
            />
          </form>
        </div>

        {/* Right: Language Switcher, Theme Toggle, Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
              title="Change Language"
            >
              <span>{currentLangObj.flag}</span>
              <span className="hidden sm:inline uppercase">{currentLangObj.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 shadow-xl z-50 animate-slideDown">
                {languagesList.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLang(item.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      lang === item.code
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-4 shadow-xl z-50 animate-slideDown">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('notifications')}</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {lang === 'uz' ? "Barchasini o'qilgan qilish" : lang === 'ru' ? "Прочитать все" : "Mark all as read"}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      {lang === 'uz' ? "Hozircha bildirishnomalar yo'q" : lang === 'ru' ? "Нет уведомлений" : "No notifications yet"}
                    </div>
                  ) : (
                    notifications.slice(0, 4).map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer flex gap-3 ${
                          notif.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 opacity-75'
                            : 'bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t('viewAll')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          {patient ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="User profile menu"
              >
                <Avatar
                  src={patient.avatar}
                  name={patient.name}
                  size="sm"
                  status="online"
                />
                <div className="hidden lg:block text-left pr-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                    {patient.name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {t('portalTitle')}
                  </p>
                </div>
                <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-2 shadow-xl z-50 animate-slideDown">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{patient.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{patient.email}</p>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{t('myProfile')}</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>{t('accountSettings')}</span>
                    </Link>

                    <Link
                      to="/patient/appointments"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{t('myAppointments')}</span>
                    </Link>

                    <Link
                      to="/todo"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      <CheckSquare className="w-4 h-4 text-slate-400" />
                      <span>{t('myTasks')}</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

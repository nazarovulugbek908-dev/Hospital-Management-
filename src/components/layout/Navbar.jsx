// Responsive Top Navigation Bar for Hospital Management System (Healthcare Theme + i18n)

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { LanguageSelector } from '../common/LanguageSelector.jsx';
import {
  Activity,
  User,
  LogOut,
  Bell,
  Stethoscope,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Search,
  CheckCircle2,
  X,
  Menu
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onOpenAuthModal, onBookAppointment }) {
  const { user, doctorProfile, patientProfile, isAdmin, isDoctor, isPatient, isOnDuty, toggleDutyStatus, logout } = useAuth();
  const { t } = useLanguage();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock Notifications
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'New Appointment Scheduled', time: '10 mins ago', read: false },
    { id: 2, title: 'Lab Test Results Approved', time: '1 hour ago', read: false },
    { id: 3, title: 'System Security Audit Clean', time: '3 hours ago', read: true }
  ]);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const displayName = isAdmin
    ? user?.name || 'System Administrator'
    : isDoctor
    ? doctorProfile?.fullName || user?.name || 'Dr. Sarah Jenkins'
    : patientProfile?.fullName || user?.name || 'Eleanor Vance';

  const avatarUrl = isAdmin
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    : isDoctor
    ? doctorProfile?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    : patientProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200';

  const roleLabelKey = isAdmin ? 'admin' : isDoctor ? 'doctor' : 'patient';

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between shadow-xl">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Activity className="w-5.5 h-5.5 text-sky-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              MedPulse <span className="text-sky-400 font-semibold text-xs px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">HMS</span>
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
              {t(roleLabelKey)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">{t('systemTagline')}</p>
        </div>
      </div>

      {/* Center: Language Selector (UZ | RU | EN) */}
      <div className="flex items-center gap-2">
        <LanguageSelector variant="header" />
      </div>

      {/* Right: Actions, Notifications & Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Book Appointment Shortcut for Patients */}
        {isPatient && onBookAppointment && (
          <button
            onClick={() => onBookAppointment()}
            className="hidden md:flex px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all transform active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('bookAppointment')}</span>
          </button>
        )}

        {/* Doctor Duty Toggle */}
        {isDoctor && (
          <button
            onClick={toggleDutyStatus}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              isOnDuty
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>{isOnDuty ? t('onDutyStatus') : t('offDutyStatus')}</span>
          </button>
        )}

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            title={t('notifications')}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-white">{t('notifications')}</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold text-sky-400 hover:underline"
                  >
                    {t('markAllRead')}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {notificationsList.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-2xl border text-xs space-y-0.5 transition-colors ${
                      notif.read ? 'bg-slate-950/60 border-slate-800/60 text-slate-400' : 'bg-sky-500/10 border-sky-500/30 text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{notif.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{notif.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-xl object-cover border border-sky-500/40"
            />
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">{displayName}</p>
              <p className="text-[10px] text-sky-400 font-mono capitalize">{t(roleLabelKey)}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-2.5 space-y-1.5 text-xs z-50 animate-fadeIn">
              <div className="p-2.5 border-b border-slate-800 mb-1">
                <p className="font-bold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold uppercase">
                  {t(roleLabelKey)}
                </span>
              </div>

              <button
                onClick={() => {
                  setActiveTab('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full p-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>{t('navProfile')}</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenAuthModal();
                }}
                className="w-full p-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('selectRole')}</span>
              </button>

              <div className="pt-1.5 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full p-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

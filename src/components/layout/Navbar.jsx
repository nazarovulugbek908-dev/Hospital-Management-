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

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Consultation Request',
      time: '10m ago',
      read: false,
      desc: 'Eleanor Vance requested an appointment for tomorrow at 10:00 AM.'
    },
    {
      id: 2,
      title: 'Lab Report Ready',
      time: '1h ago',
      read: false,
      desc: 'Blood work results for Patient #P-1002 are ready for review.'
    },
    {
      id: 3,
      title: 'Shift Reminder',
      time: '3h ago',
      read: true,
      desc: 'Your afternoon shift starts at 2:00 PM in Wing B.'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-extrabold border border-rose-500/20 uppercase tracking-wider">
          Admin
        </span>
      );
    }
    if (isDoctor) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-extrabold border border-sky-500/20 uppercase tracking-wider">
          Doctor
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-extrabold border border-teal-500/20 uppercase tracking-wider">
        Patient
      </span>
    );
  };

  const displayName = isAdmin
    ? (user?.name || 'Hospital Admin')
    : isDoctor
    ? (doctorProfile?.fullName || user?.name || 'Dr. Sarah Jenkins')
    : (patientProfile?.fullName || user?.name || 'Eleanor Vance');

  const displaySubtitle = isAdmin
    ? 'System Administrator'
    : isDoctor
    ? (doctorProfile?.specialization || 'Cardiologist')
    : (patientProfile?.email || user?.email || 'Patient Member');

  const avatarUrl = isDoctor
    ? (doctorProfile?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80')
    : isPatient
    ? (patientProfile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80')
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>{t('portalTitle')}</span>
              </h1>
              {getRoleBadge()}
            </div>
            <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
              MedPulse Care System • International Standard
            </p>
          </div>
        </div>

        {/* Action Controls & Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Quick Book Appointment Button for Patients */}
          {isPatient && (
            <button
              onClick={() => onBookAppointment && onBookAppointment()}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t('bookAppointment')}</span>
            </button>
          )}

          {/* Doctor On-Duty Toggle */}
          {isDoctor && (
            <button
              onClick={toggleDutyStatus}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isOnDuty
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{isOnDuty ? t('onDuty') : t('offDuty')}</span>
            </button>
          )}

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-bold text-white">{t('notifications')}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                      {unreadCount} {t('unread')}
                    </span>
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    {t('markAllRead')}
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                        notif.read
                          ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                          : 'bg-slate-950 border-sky-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between font-semibold text-white">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{notif.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">{notif.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(prev => !prev)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
            >
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-lg object-cover border border-sky-500/40"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-white leading-tight">{displayName}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{displaySubtitle}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{displaySubtitle}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4 text-sky-400" />
                  <span>{t('myProfile')}</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenAuthModal && onOpenAuthModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>{t('switchRole')}</span>
                </button>

                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

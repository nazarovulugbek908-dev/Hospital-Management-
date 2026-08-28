// Responsive Sidebar Navigation Component (Admin, Doctor, Patient + i18n)

import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Search,
  Stethoscope,
  Building2,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  LogOut,
  Settings
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, counts = {}, onBookAppointment }) {
  const { isAdmin, isDoctor, isPatient, doctorProfile, patientProfile, user, logout } = useAuth();
  const { t } = useLanguage();

  const adminNav = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard, badge: null },
    { id: 'doctors', label: t('navDoctors'), icon: Stethoscope, badge: counts.totalDoctors || null },
    { id: 'patients', label: t('navPatients'), icon: Users, badge: counts.totalPatients || null },
    { id: 'appointments', label: t('navAppointments'), icon: Calendar, badge: counts.pendingAppointments || null },
    { id: 'departments', label: t('navDepartments'), icon: Building2, badge: counts.totalDepartments || null },
    { id: 'statistics', label: t('navStatistics'), icon: BarChart3, badge: null }
  ];

  const doctorNav = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard, badge: null },
    { id: 'appointments', label: t('navAppointments'), icon: Calendar, badge: counts.todayAppointments > 0 ? counts.todayAppointments : null },
    { id: 'patients', label: t('navPatients'), icon: Users, badge: counts.totalPatients > 0 ? counts.totalPatients : null },
    { id: 'profile', label: t('navProfile'), icon: UserCheck, badge: null }
  ];

  const patientNav = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard, badge: null },
    { id: 'findDoctors', label: t('navFindDoctors'), icon: Search, badge: null },
    { id: 'appointments', label: t('navAppointments'), icon: Calendar, badge: counts.upcomingCount > 0 ? counts.upcomingCount : null },
    { id: 'profile', label: t('navProfile'), icon: UserCheck, badge: null }
  ];

  const currentNav = isAdmin ? adminNav : isDoctor ? doctorNav : patientNav;

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

  const roleKey = isAdmin ? 'admin' : isDoctor ? 'doctor' : 'patient';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 min-h-[calc(100vh-65px)] p-4 space-y-6 flex-shrink-0">
      {/* User Identity Header Card */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-11 h-11 rounded-2xl object-cover border border-sky-500/30 shadow-md"
          />
          <div className="space-y-0.5 overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{displayName}</h4>
            <span className="inline-block px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold uppercase">
              {t(roleKey)}
            </span>
          </div>
        </div>

        {isPatient && onBookAppointment && (
          <button
            onClick={() => onBookAppointment()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('bookAppointment')}</span>
          </button>
        )}
      </div>

      {/* Role Navigation Links */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          {t(roleKey)} Navigation
        </p>

        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-transparent text-sky-300 border border-sky-500/30 shadow-md shadow-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout Footer Button */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}

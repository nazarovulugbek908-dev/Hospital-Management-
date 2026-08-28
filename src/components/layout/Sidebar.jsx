// Responsive Sidebar Navigation Component (Admin, Doctor, Patient + i18n)

import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  Users,
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
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'doctors', label: t('navDoctors'), icon: Stethoscope, badge: counts.totalDoctors },
    { id: 'patients', label: t('navPatients'), icon: Users, badge: counts.totalPatients },
    { id: 'appointments', label: t('navAppointments'), icon: Calendar, badge: counts.pendingAppointments },
    { id: 'departments', label: t('totalDepartments'), icon: Building2, badge: counts.totalDepartments },
    { id: 'statistics', label: t('navStatistics'), icon: BarChart3 }
  ];

  const doctorNav = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'appointments', label: t('navAppointments'), icon: Calendar, badge: counts.todayAppointments },
    { id: 'patients', label: t('navPatients'), icon: Users, badge: counts.totalPatients },
    { id: 'profile', label: t('navProfile'), icon: UserCheck }
  ];

  const patientNav = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'findDoctors', label: t('navFindDoctors'), icon: Search },
    { id: 'appointments', label: t('navAppointments'), icon: Calendar, badge: counts.upcomingCount },
    { id: 'profile', label: t('navProfile'), icon: UserCheck }
  ];

  const navItems = isAdmin ? adminNav : isDoctor ? doctorNav : patientNav;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-4 space-y-6 min-h-[calc(100vh-65px)]">
      {/* Patient Quick Action */}
      {isPatient && (
        <button
          onClick={() => onBookAppointment && onBookAppointment()}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>{t('bookAppointment')}</span>
        </button>
      )}

      {/* Navigation Groups */}
      <div className="space-y-1 flex-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          {isAdmin ? 'Administration' : isDoctor ? 'Clinical Panel' : 'Patient Services'}
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Card & Logout */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-500/30">
            {isAdmin ? 'AD' : isDoctor ? 'DR' : 'PT'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {isAdmin
                ? 'Admin User'
                : isDoctor
                ? (doctorProfile?.fullName || 'Dr. Sarah')
                : (patientProfile?.fullName || 'Eleanor Vance')}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {isAdmin ? 'Full System Access' : isDoctor ? (doctorProfile?.department || 'Medical Staff') : 'Patient Member'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}

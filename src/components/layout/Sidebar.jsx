// Sidebar Navigation Component for Doctor Panel

import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, Users, Calendar, UserCheck, Stethoscope, Activity, Heart, Clock, ChevronRight } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, counts = {} }) {
  const { doctorProfile, isOnDuty } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: counts.todayAppointments > 0 ? `${counts.todayAppointments} today` : null,
      badgeColor: 'bg-teal-500/20 text-teal-300'
    },
    {
      id: 'patients',
      label: 'My Patients',
      icon: Users,
      badge: counts.totalPatients ? counts.totalPatients : null,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'profile',
      label: 'Doctor Profile',
      icon: UserCheck,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-61px)] p-4 select-none">
      <div className="space-y-6">
        {/* Brand/Hospital badge */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-900/30 to-slate-900 border border-teal-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Hospital Care</div>
            <div className="text-[11px] text-teal-400 flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3" />
              <span>Doctor Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Main Navigation
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-teal-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-700 ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Doctor Quick Card */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Hours Today
            </span>
            <span className="text-slate-200 font-semibold text-[11px]">08:30 - 16:30</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Cabinet
            </span>
            <span className="text-slate-200 font-semibold text-[11px]">
              {doctorProfile?.roomNo || 'Room 304'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-[11px] text-slate-300 font-medium">
                {isOnDuty ? 'Active Duty' : 'Off Duty'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">v2.4.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Top Navigation Bar for Doctor Panel

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Search, Bell, Calendar, User, LogOut, CheckCircle, ShieldAlert } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onOpenAuthModal }) {
  const { doctorProfile, user, isDoctor, isOnDuty, toggleDutyStatus, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'New Appointment', desc: 'Amara Okafor requested appointment on Thursday', time: '10m ago', unread: true },
    { id: 2, title: 'ECG Results Ready', desc: 'Holter report for Sophia Martinez uploaded by Lab', time: '45m ago', unread: true },
    { id: 3, title: 'Shift Reminder', desc: 'Scheduled duty begins at 08:30 AM tomorrow', time: '2h ago', unread: false }
  ];

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between shadow-lg">
      {/* Left side title / quick search */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Doctor Workspace</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
              PRO PANEL
            </span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {todayFormatted} • Hospital Management System
          </p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* On Duty Status Switcher */}
        {isDoctor && (
          <button
            onClick={toggleDutyStatus}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              isOnDuty
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
            title="Toggle On Duty status"
          >
            <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="hidden md:inline">{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
          </button>
        )}

        {/* Role status pill */}
        {!isDoctor && (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Switch to Doctor Role</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <span className="text-xs text-teal-400 font-medium">3 New</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-slate-800/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile Chip */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pl-2 pr-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all group"
          >
            <img
              src={doctorProfile?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
              alt="Doctor Avatar"
              className="w-8 h-8 rounded-xl object-cover border border-teal-500/30 group-hover:scale-105 transition-transform"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition-colors">
                {doctorProfile?.fullName || user?.name || 'Dr. Sarah Jenkins'}
              </div>
              <div className="text-[10px] text-slate-400">
                {doctorProfile?.specialization || 'Cardiology'}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2">
              <div className="p-3 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-bold text-white">{doctorProfile?.fullName || 'Dr. Sarah Jenkins'}</p>
                <p className="text-[11px] text-slate-400 truncate">{doctorProfile?.email || 'sarah.jenkins@hospital.org'}</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 transition-colors"
              >
                <User className="w-4 h-4 text-teal-400" />
                View & Edit Profile
              </button>
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Switch User / Role
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

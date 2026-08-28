// Admin Dashboard Component - Hospital Management System

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../common/ToastContainer.jsx';
import { Spinner, StatSkeleton } from '../common/LoadingSkeleton.jsx';
import { StatCard } from '../common/StatCard.jsx';
import { StatusBadge } from '../common/Badge.jsx';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  Building2,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';

export function AdminDashboard({ setActiveTab }) {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Doctors & Patients quick lists
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);

  // Modal for adding a new doctor
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docSpec, setDocSpec] = useState('Cardiology');
  const [docDept, setDocDept] = useState('Cardiovascular Care');
  const [submittingDoc, setSubmittingDoc] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setStats(data);
      const docs = await api.getAllDoctors();
      setDoctorsList(docs);
      const appts = await api.getDoctorAppointments('doc-101', 'All');
      setAppointmentsList(appts);
    } catch (err) {
      console.error('Error loading Admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setSubmittingDoc(true);
    try {
      await api.register({
        role: 'doctor',
        fullName: docName,
        email: docEmail,
        phone: docPhone,
        specialization: docSpec,
        department: docDept
      });
      showToast('Doctor registered successfully!', 'success');
      setIsAddDoctorOpen(false);
      setDocName('');
      setDocEmail('');
      setDocPhone('');
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to add doctor', 'error');
    } finally {
      setSubmittingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      </div>
    );
  }

  // Calculate percentages for status chart
  const totalAppts = (stats?.confirmedAppointments || 0) + (stats?.pendingAppointments || 0) + (stats?.completedAppointments || 0) + (stats?.cancelledAppointments || 0) || 1;
  const pendingPct = Math.round(((stats?.pendingAppointments || 0) / totalAppts) * 100);
  const confirmedPct = Math.round(((stats?.confirmedAppointments || 0) / totalAppts) * 100);
  const completedPct = Math.round(((stats?.completedAppointments || 0) / totalAppts) * 100);
  const cancelledPct = Math.round(((stats?.cancelledAppointments || 0) / totalAppts) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('admin')} {t('navDashboard')}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {t('adminDashboardTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t('adminDashboardSub')}
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <button
            onClick={() => setIsAddDoctorOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('addNewDoctor')}</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('totalDoctors')}
          value={stats?.totalDoctors || 0}
          icon={Stethoscope}
          color="teal"
          description="Active clinical practitioners"
        />

        <StatCard
          title={t('totalPatients')}
          value={stats?.totalPatients || 0}
          icon={Users}
          color="sky"
          description="Registered patient records"
        />

        <StatCard
          title={t('todayAppointments')}
          value={stats?.todayAppointments || 0}
          icon={Calendar}
          color="indigo"
          description="Scheduled for today"
        />

        <StatCard
          title={t('pendingAppointments')}
          value={stats?.pendingAppointments || 0}
          icon={Clock}
          color="amber"
          description="Awaiting doctor confirmation"
        />
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Status Distribution (Visual Chart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span>{t('appointmentStatusChart')}</span>
              </h3>
              <p className="text-xs text-slate-400">Live backend appointment metric breakdown</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300">
              Total: {totalAppts}
            </span>
          </div>

          {/* Custom SVG Bar Chart Visualizer */}
          <div className="space-y-4 pt-2">
            {/* Horizontal Stacked Bar */}
            <div className="w-full h-5 rounded-xl bg-slate-950 p-1 flex overflow-hidden border border-slate-800">
              <div style={{ width: `${completedPct}%` }} className="h-full bg-emerald-500 rounded-l-lg transition-all duration-500" title={`Completed: ${completedPct}%`} />
              <div style={{ width: `${confirmedPct}%` }} className="h-full bg-sky-500 transition-all duration-500" title={`Confirmed: ${confirmedPct}%`} />
              <div style={{ width: `${pendingPct}%` }} className="h-full bg-amber-500 transition-all duration-500" title={`Pending: ${pendingPct}%`} />
              <div style={{ width: `${cancelledPct}%` }} className="h-full bg-rose-500 rounded-r-lg transition-all duration-500" title={`Cancelled: ${cancelledPct}%`} />
            </div>

            {/* Status Breakdown Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </div>
                <div className="text-lg font-black text-white">{stats?.completedAppointments || 0}</div>
                <div className="text-[10px] text-slate-500 font-mono">{completedPct}% of total</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Confirmed</span>
                </div>
                <div className="text-lg font-black text-white">{stats?.confirmedAppointments || 0}</div>
                <div className="text-[10px] text-slate-500 font-mono">{confirmedPct}% of total</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending</span>
                </div>
                <div className="text-lg font-black text-white">{stats?.pendingAppointments || 0}</div>
                <div className="text-[10px] text-slate-500 font-mono">{pendingPct}% of total</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancelled</span>
                </div>
                <div className="text-lg font-black text-white">{stats?.cancelledAppointments || 0}</div>
                <div className="text-[10px] text-slate-500 font-mono">{cancelledPct}% of total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Departments Breakdown Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>{t('totalDepartments')}</span>
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/30">
              {stats?.totalDepartments || 0} Departments
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.departmentsList?.map((dept, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">{dept}</div>
                  <div className="text-[11px] text-slate-500">Specialist consultations</div>
                </div>
                <StatusBadge status="Active" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Directory Preview Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-sky-400" />
              <span>{t('doctorRoster')}</span>
            </h3>
            <p className="text-xs text-slate-400">Registered hospital medical specialists</p>
          </div>

          <button
            onClick={() => setActiveTab('doctors')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>{t('view')} {t('all')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 rounded-l-xl">{t('doctorName')}</th>
                <th className="p-3.5">{t('specializationLabel')}</th>
                <th className="p-3.5">{t('departmentLabel')}</th>
                <th className="p-3.5">{t('roomCabinet')}</th>
                <th className="p-3.5">{t('experience')}</th>
                <th className="p-3.5 rounded-r-xl">{t('rating')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {doctorsList.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-semibold text-white flex items-center gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-slate-100">{doc.fullName}</div>
                      <div className="text-[10px] text-slate-400">{doc.email}</div>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">{doc.specialization}</td>
                  <td className="p-3.5 text-slate-400">{doc.department}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{doc.roomNo}</td>
                  <td className="p-3.5 text-slate-300">{doc.experience}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-[11px]">
                      ★ {doc.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Doctor */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{t('addNewDoctor')}</h3>
              </div>
              <button
                onClick={() => setIsAddDoctorOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">{t('fullNameLabel')} *</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  required
                  placeholder="Dr. Alexander Wright"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">{t('emailLabel')} *</label>
                <input
                  type="email"
                  value={docEmail}
                  onChange={(e) => setDocEmail(e.target.value)}
                  required
                  placeholder="alex.wright@hospital.org"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">{t('phoneLabel')}</label>
                <input
                  type="text"
                  value={docPhone}
                  onChange={(e) => setDocPhone(e.target.value)}
                  placeholder="+1 (555) 777-8899"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">{t('specializationLabel')}</label>
                  <input
                    type="text"
                    value={docSpec}
                    onChange={(e) => setDocSpec(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">{t('departmentLabel')}</label>
                  <input
                    type="text"
                    value={docDept}
                    onChange={(e) => setDocDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submittingDoc}
                  className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400 flex items-center gap-1.5"
                >
                  {submittingDoc && <Spinner size="sm" />}
                  <span>{t('save')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

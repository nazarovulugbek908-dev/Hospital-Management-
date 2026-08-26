// Doctor Profile Component with Edit and Form Validation Capabilities

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { useToast } from '../common/ToastContainer.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import { User, Mail, Phone, Stethoscope, Building, Award, Calendar, Clock, Edit3, Save, X, AlertCircle, CheckCircle2, Image } from 'lucide-react';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function DoctorProfile() {
  const { user, doctorProfile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    experience: '',
    biography: '',
    workingDays: [],
    workingHours: '',
    avatar: '',
    roomNo: ''
  });

  useEffect(() => {
    if (doctorProfile) {
      setFormData({
        fullName: doctorProfile.fullName || '',
        email: doctorProfile.email || '',
        phone: doctorProfile.phone || '',
        specialization: doctorProfile.specialization || '',
        department: doctorProfile.department || '',
        experience: doctorProfile.experience || '',
        biography: doctorProfile.biography || '',
        workingDays: doctorProfile.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: doctorProfile.workingHours || '08:30 AM - 04:30 PM',
        avatar: doctorProfile.avatar || '',
        roomNo: doctorProfile.roomNo || 'Cabinet 304'
      });
    }
  }, [doctorProfile]);

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    }
    if (!formData.specialization.trim()) errs.specialization = 'Specialization is required';
    if (!formData.department.trim()) errs.department = 'Department is required';
    if (formData.workingDays.length === 0) errs.workingDays = 'Select at least one working day';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const current = prev.workingDays || [];
      const updated = current.includes(day)
        ? current.filter(d => d !== day)
        : [...current, day];
      return { ...prev, workingDays: updated };
    });
    if (errors.workingDays) {
      setErrors(prev => ({ ...prev, workingDays: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the profile form', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.updateDoctorProfile(doctorProfile.id, formData);
      await refreshProfile();
      showToast('Doctor Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err.message || 'Failed to update doctor profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-teal-400" />
            <span>Doctor Profile</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal information, specialization, biography, and working schedule.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setErrors({});
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Profile View / Edit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl text-center">
          <div className="relative inline-block mx-auto">
            <img
              src={formData.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
              alt="Doctor Avatar"
              className="w-36 h-36 rounded-3xl object-cover border-4 border-teal-500/30 shadow-2xl mx-auto"
            />
            <div className="absolute -bottom-2 right-2 p-2 rounded-xl bg-teal-500 text-slate-950 shadow-lg">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{formData.fullName || 'Dr. Sarah Jenkins'}</h3>
            <p className="text-xs text-teal-400 font-semibold mt-1">{formData.specialization}</p>
            <p className="text-xs text-slate-400">{formData.department}</p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span className="truncate">{formData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>{formData.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Award className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>{formData.experience} Experience</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Building className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>{formData.roomNo}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed View / Edit Form */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-8">
              {/* Biography */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-400" />
                  <span>Professional Biography</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  {formData.biography || 'No biography provided yet.'}
                </p>
              </div>

              {/* Specialization & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Specialization</span>
                  <p className="text-sm font-bold text-white">{formData.specialization}</p>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Department</span>
                  <p className="text-sm font-bold text-white">{formData.department}</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Working Schedule</span>
                </h4>

                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 space-y-4">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Working Hours:</span>
                    <span className="text-slate-200 font-semibold">{formData.workingHours}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-2">Working Days:</span>
                    <div className="flex flex-wrap gap-2">
                      {ALL_DAYS.map(day => {
                        const isWorking = formData.workingDays?.includes(day);
                        return (
                          <span
                            key={day}
                            className={`px-3 py-1 rounded-xl text-xs font-medium border ${
                              isWorking
                                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT FORM MODE */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
                Update Doctor Information
              </h3>

              {/* Full Name & Avatar URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.fullName ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="e.g. Dr. Sarah Jenkins"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Avatar Image URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="sarah.jenkins@hospital.org"
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.phone ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="+1 (555) 234-5678"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Specialization, Department, Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.specialization ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="e.g. Cardiology"
                  />
                  {errors.specialization && <p className="text-[11px] text-rose-400 mt-1">{errors.specialization}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.department ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="e.g. Cardiovascular Care"
                  />
                  {errors.department && <p className="text-[11px] text-rose-400 mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. 12 Years"
                  />
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="e.g. 08:30 AM - 04:30 PM"
                />
              </div>

              {/* Working Days Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Working Days *</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DAYS.map(day => {
                    const checked = formData.workingDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          checked
                            ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/20'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                {errors.workingDays && <p className="text-[11px] text-rose-400 mt-1">{errors.workingDays}</p>}
              </div>

              {/* Biography */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Biography & Notes</label>
                <textarea
                  name="biography"
                  rows="4"
                  value={formData.biography}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors resize-y"
                  placeholder="Enter medical biography, clinical focus, or credentials..."
                />
              </div>

              {/* Form Action buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

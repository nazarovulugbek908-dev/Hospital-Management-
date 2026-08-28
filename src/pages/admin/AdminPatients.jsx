import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Heart,
  Calendar,
  ShieldAlert,
  Activity,
  MapPin,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Avatar, Badge } from '../../components/common/Badge.jsx';
import { AddPatientModal } from '../../components/admin/AddPatientModal.jsx';

export function AdminPatients() {
  const { patients, addPatient, updatePatient, deletePatient } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchBlood = selectedBloodGroup === 'All' || p.bloodGroup === selectedBloodGroup;
      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.medicalCondition?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q);
      return matchBlood && matchStatus && matchQuery;
    });
  }, [patients, selectedBloodGroup, selectedStatus, searchQuery]);

  const handleOpenAdd = () => {
    setPatientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setPatientToEdit(patient);
    setIsModalOpen(true);
  };

  const handleSavePatient = (patientData) => {
    if (patientToEdit) {
      updatePatient(patientToEdit.id, patientData);
      showToast(
        lang === 'uz' ? `Bemor ${patientData.name} ma‘lumotlari yangilandi.` : 'Patient records updated.',
        'success'
      );
    } else {
      addPatient(patientData);
      showToast(
        lang === 'uz' ? `Yangi bemor ${patientData.name} ro‘yxatga olindi!` : 'New patient enrolled successfully!',
        'success'
      );
    }
  };

  const handleDeletePatient = (id, name) => {
    if (window.confirm(lang === 'uz' ? `Haqiqatan ham bemor ${name}ni o‘chirmoqchimisiz?` : `Delete patient record for ${name}?`)) {
      deletePatient(id);
      showToast(
        lang === 'uz' ? `Bemor ${name} o‘chirildi.` : 'Patient record deleted.',
        'info'
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('managePatients')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'uz'
              ? `Tizimda jami ${patients.length} nafar bemor ro‘yxatdan o‘tgan. Yangi bemorlarni kiritish yoki profillarini tahrirlash.`
              : `Total ${patients.length} enrolled patients. Add new patient profiles or manage health records.`}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addPatient')}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchPatients')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Blood Group Select */}
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">{t('bloodGroup')}: {t('filterAll')}</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">{t('status')}: {t('filterAll')}</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Cards / Table */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {lang === 'uz' ? 'Bemorlar topilmadi' : 'No patients found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {lang === 'uz' ? 'Qidiruv parametrlarini o‘zgartiring yoki yangi bemor qo‘shing.' : 'Try adjusting search query or register a new patient.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            {t('addPatient')}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">{t('patientName')}</th>
                  <th className="py-3.5 px-4">{t('phoneNumber')} / Email</th>
                  <th className="py-3.5 px-4">{t('bloodGroup')}</th>
                  <th className="py-3.5 px-4">{t('medicalCondition')}</th>
                  <th className="py-3.5 px-4">{t('status')}</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                    {/* Patient Name & Avatar */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar src={p.avatar} alt={p.name} size="md" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {p.gender || 'Male'} • {p.dateOfBirth || '1995-01-01'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.phone || 'N/A'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {p.email || 'No email registered'}
                      </div>
                    </td>

                    {/* Blood Group */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-black text-xs">
                        {p.bloodGroup || 'A+'}
                      </span>
                    </td>

                    {/* Medical Condition */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <Activity className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{p.medicalCondition || 'Routine Wellness Checkup'}</span>
                      </div>
                      {p.emergencyContact && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {p.emergencyContact}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <Badge variant={p.status === 'Active' ? 'success' : 'neutral'}>
                        {p.status || 'Active'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-bold"
                        title={t('edit')}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('edit')}</span>
                      </button>
                      <button
                        onClick={() => handleDeletePatient(p.id, p.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors inline-flex items-center gap-1 font-bold"
                        title={t('delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Patient Modal */}
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
      />

    </div>
  );
}

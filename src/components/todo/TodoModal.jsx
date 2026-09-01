import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Input, Select } from '../common/Input.jsx';

export function TodoModal({ isOpen, onClose, onSave, taskToEdit }) {
  const { t } = useLanguage();
  const getToday = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: getToday(),
    category: 'Personal',
    status: 'Todo'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Medium',
        dueDate: taskToEdit.dueDate || getToday(),
        category: taskToEdit.category || 'Personal',
        status: taskToEdit.status || 'Todo'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: getToday(),
        category: 'Personal',
        status: 'Todo'
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = t('taskTitle') || 'Task title is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? t('editTask') : t('addNewTask')}
      subtitle={taskToEdit ? t('editTaskSubtitle') : t('addTaskSubtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label={t('taskTitle')}
          placeholder={t('taskTitlePlaceholder')}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t('taskDesc')}
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('taskDescPlaceholder')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label={t('priorityLevel')}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            options={[
              { value: 'Low', label: `🟢 ${t('priorityLow')}` },
              { value: 'Medium', label: `🟡 ${t('priorityMedium')}` },
              { value: 'High', label: `🔴 ${t('priorityHigh')}` }
            ]}
          />

          <Select
            label={t('category')}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Personal', label: `🏠 ${t('categoryPersonal')}` },
              { value: 'Appointment', label: `🩺 ${t('categoryAppointment')}` },
              { value: 'Study', label: `📚 ${t('categoryStudy')}` },
              { value: 'Work', label: `💼 ${t('categoryWork')}` },
              { value: 'Other', label: `📌 ${t('categoryOther')}` }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('dueDate')}
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <Select
            label={t('status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Todo', label: t('filterTodo') },
              { value: 'In Progress', label: t('filterInProgress') },
              { value: 'Completed', label: t('filterCompleted') }
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {taskToEdit ? t('saveChangesTask') : t('createTask')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

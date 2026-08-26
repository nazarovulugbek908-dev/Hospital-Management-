import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Input, Select } from '../common/Input.jsx';

export function TodoModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '2026-08-28',
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
        dueDate: taskToEdit.dueDate || '2026-08-28',
        category: taskToEdit.category || 'Personal',
        status: taskToEdit.status || 'Todo'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '2026-08-28',
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
      newErrors.title = 'Task title is required';
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
      title={taskToEdit ? 'Edit Task' : 'Add New Task'}
      subtitle={taskToEdit ? 'Update your task details and deadline' : 'Organize your daily health and productivity tasks'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label="Task Title"
          placeholder="e.g., Take morning blood pressure reading"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add relevant notes, medication doses, or appointment reminders..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority Level"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            options={[
              { value: 'Low', label: '🟢 Low' },
              { value: 'Medium', label: '🟡 Medium' },
              { value: 'High', label: '🔴 High' }
            ]}
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Personal', label: '🏠 Personal' },
              { value: 'Appointment', label: '🩺 Appointment' },
              { value: 'Study', label: '📚 Study' },
              { value: 'Work', label: '💼 Work' },
              { value: 'Other', label: '📌 Other' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Todo', label: 'To Do' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

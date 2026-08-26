import React, { useState } from 'react';
import {
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  ListTodo,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { TodoCard } from '../../components/todo/TodoCard.jsx';
import { TodoModal } from '../../components/todo/TodoModal.jsx';
import { ConfirmDialog } from '../../components/common/Modal.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export function Todo() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Todo' | 'In Progress' | 'Completed' | 'High Priority'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  // Todo Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Todo').length;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Todo') return task.status === 'Todo';
    if (activeFilter === 'In Progress') return task.status === 'In Progress';
    if (activeFilter === 'Completed') return task.status === 'Completed';
    if (activeFilter === 'High Priority') return task.priority === 'High';

    return true;
  });

  const handleSaveTask = (formData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
      showToast(lang === 'uz' ? 'Vazifa muvaffaqiyatli yangilandi.' : 'Task updated successfully.', 'success');
    } else {
      addTask(formData);
      showToast(lang === 'uz' ? 'Yangi vazifa yaratildi.' : 'Task created successfully.', 'success');
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      showToast(lang === 'uz' ? 'Vazifa o‘chirildi.' : 'Task removed from list.', 'info');
      setDeleteTaskId(null);
    }
  };

  const handleToggle = (id) => {
    toggleTaskStatus(id);
    const target = tasks.find(t => t.id === id);
    if (target && target.status !== 'Completed') {
      showToast(lang === 'uz' ? 'Vazifa bajarildi! 🎉' : 'Task completed! 🎉', 'success');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>{t('tasksTitle')}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('tasksSubtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
        >
          {t('addNewTaskBtn')}
        </Button>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('taskTotal')}
          value={totalTasks}
          subtitle={t('allActivities')}
          icon={ListTodo}
          color="primary"
        />
        <StatCard
          title={t('taskCompleted')}
          value={completedTasks}
          subtitle={totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% progress` : '0%'}
          icon={CheckCircle2}
          color="success"
        />
        <StatCard
          title={t('taskInProgress')}
          value={inProgressTasks}
          subtitle={t('activeItems')}
          icon={Clock}
          color="warning"
        />
        <StatCard
          title={t('taskPending')}
          value={pendingTasks}
          subtitle={t('awaitingStart')}
          icon={AlertCircle}
          color="secondary"
        />
      </div>

      {/* Search & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchTasks')}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'All', label: t('filterAll') },
            { id: 'Todo', label: t('filterTodo') },
            { id: 'In Progress', label: t('filterInProgress') },
            { id: 'Completed', label: t('filterCompleted') },
            { id: 'High Priority', label: t('filterHighPriority') }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={t('noTasksTitle')}
          description={t('noTasksMatch')}
          actionLabel={t('addNewTaskBtn')}
          onAction={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={(t) => {
                setTaskToEdit(t);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setDeleteTaskId(id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleConfirmDelete}
        title={t('deleteTaskTitle')}
        message={t('deleteTaskDesc')}
        confirmText={t('confirmDeleteBtn')}
      />
    </div>
  );
}

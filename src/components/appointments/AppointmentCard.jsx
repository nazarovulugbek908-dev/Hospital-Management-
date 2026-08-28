import React from 'react';
import { Calendar, Clock, MapPin, Stethoscope, Eye, X } from 'lucide-react';
import { Badge, Avatar } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export function AppointmentCard({
  appointment,
  onView,
  onCancel,
  showActions = true
}) {
  const statusVariants = {
    Confirmed: 'success',
    Pending: 'warning',
    Completed: 'primary',
    Cancelled: 'danger'
  };

  const isCancelled = appointment.status === 'Cancelled';
  const isCompleted = appointment.status === 'Completed';

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      {/* Doctor Info & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <Avatar
            src={appointment.doctorAvatar}
            name={appointment.doctorName}
            size="md"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {appointment.doctorName}
            </h4>
            <p className="text-xs text-primary font-semibold">
              {appointment.department}
            </p>
          </div>
        </div>

        <Badge variant={statusVariants[appointment.status] || 'neutral'} size="md" dot>
          {appointment.status}
        </Badge>
      </div>

      {/* Date & Time */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-semibold">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
          <span className="font-semibold">{appointment.time}</span>
        </div>
      </div>

      {/* Reason */}
      {appointment.reason && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          <strong className="text-slate-700 dark:text-slate-300">Reason:</strong> {appointment.reason}
        </p>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              className="flex-1 text-xs"
              onClick={() => onView(appointment)}
            >
              View Details
            </Button>
          )}

          {onCancel && !isCancelled && !isCompleted && (
            <Button
              variant="danger"
              size="sm"
              icon={X}
              className="flex-1 text-xs"
              onClick={() => onCancel(appointment.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

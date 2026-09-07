import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export default function CalendarView({ tasks, onTasksChange }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const toggleTaskDone = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: (t.status === 'done' ? 'todo' : 'done') as Task['status'],
            completedAt: t.status === 'done' ? null : new Date().toISOString(),
          }
        : t
    );
    onTasksChange(updated);
  };

  const priorityDot = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kalender</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Lihat jadwal dan deadline tugas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((wd) => (
              <div key={wd} className="text-center text-xs font-medium text-slate-400 py-2">
                {wd}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const dayTasks = getTasksForDate(d);
              const isCurrentMonth = isSameMonth(d, currentMonth);
              const isSelected = selectedDate && isSameDay(d, selectedDate);
              const today = isToday(d);

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(d)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                    !isCurrentMonth
                      ? 'text-slate-300 dark:text-slate-600'
                      : 'text-slate-700 dark:text-slate-300'
                  } ${
                    isSelected
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : today
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 font-bold text-indigo-600 dark:text-indigo-400'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-xs">{format(d, 'd')}</span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayTasks.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white/70' : priorityDot(t.priority)
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            {selectedDate
              ? format(selectedDate, 'EEEE, dd MMMM yyyy')
              : 'Pilih tanggal'}
          </h3>

          {selectedDate ? (
            selectedTasks.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {selectedTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700"
                    >
                      <button
                        onClick={() => toggleTaskDone(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                          task.status === 'done'
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                        }`}
                      >
                        {task.status === 'done' && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          task.status === 'done'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${priorityDot(task.priority)}`} />
                          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-sm text-slate-400">Tidak ada tugas di tanggal ini</p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-sm text-slate-400">Klik tanggal untuk melihat tugas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

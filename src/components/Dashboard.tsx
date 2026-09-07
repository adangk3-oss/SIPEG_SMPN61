import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ListTodo,
  Flame,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Task } from '../types';
import { format, subDays, startOfDay } from 'date-fns';

interface DashboardProps {
  tasks: Task[];
}

export default function Dashboard({ tasks }: DashboardProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < startOfDay(new Date())
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status distribution for pie chart
  const statusData = [
    { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in-progress').length, color: '#6366f1' },
    { name: 'Review', value: tasks.filter((t) => t.status === 'review').length, color: '#f59e0b' },
    { name: 'Done', value: completedTasks, color: '#10b981' },
  ];

  // Priority distribution for bar chart
  const priorityData = [
    { name: 'Low', count: tasks.filter((t) => t.priority === 'low').length, color: '#94a3b8' },
    { name: 'Medium', count: tasks.filter((t) => t.priority === 'medium').length, color: '#3b82f6' },
    { name: 'High', count: tasks.filter((t) => t.priority === 'high').length, color: '#f59e0b' },
    { name: 'Urgent', count: tasks.filter((t) => t.priority === 'urgent').length, color: '#ef4444' },
  ];

  // Activity for last 7 days
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const completed = tasks.filter(
      (t) => t.completedAt && t.completedAt.startsWith(dateStr)
    ).length;
    const created = tasks.filter((t) => t.createdAt.startsWith(dateStr)).length;
    return {
      day: format(date, 'EEE'),
      Selesai: completed,
      Dibuat: created,
    };
  });

  const stats = [
    {
      label: 'Total Tugas',
      value: totalTasks,
      icon: <ListTodo size={20} />,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Selesai',
      value: completedTasks,
      icon: <CheckCircle2 size={20} />,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'Dalam Proses',
      value: inProgressTasks,
      icon: <Clock size={20} />,
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      label: 'Terlambat',
      value: overdueTasks,
      icon: <AlertTriangle size={20} />,
      color: 'from-red-500 to-red-600',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Ringkasan produktivitas Anda hari ini
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800">
          <Flame size={18} className="text-orange-500" />
          <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
            {completionRate}% selesai
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <div className={`bg-gradient-to-br ${stat.color} text-white p-2 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-indigo-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Aktivitas 7 Hari Terakhir</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Line type="monotone" dataKey="Selesai" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="Dibuat" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Status Tugas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Priority Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Distribusi Prioritas</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tugas Terbaru</h3>
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.priority === 'urgent'
                    ? 'bg-red-500'
                    : task.priority === 'high'
                    ? 'bg-amber-500'
                    : task.priority === 'medium'
                    ? 'bg-blue-500'
                    : 'bg-slate-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {task.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {task.dueDate ? `Deadline: ${format(new Date(task.dueDate), 'dd MMM yyyy')}` : 'Tanpa deadline'}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.status === 'done'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : task.status === 'in-progress'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : task.status === 'review'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {task.status === 'todo'
                  ? 'To Do'
                  : task.status === 'in-progress'
                  ? 'Proses'
                  : task.status === 'review'
                  ? 'Review'
                  : 'Selesai'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Moon, Sun, Trash2, Download, RotateCcw } from 'lucide-react';
import { Task } from '../types';
import { getDefaultTasks } from '../store';

interface SettingsProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export default function SettingsPage({ theme, onThemeChange, tasks, onTasksChange }: SettingsProps) {
  const handleExport = () => {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskflow-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset semua tugas ke data default?')) {
      onTasksChange(getDefaultTasks());
    }
  };

  const handleClearAll = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua tugas?')) {
      onTasksChange([]);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Kustomisasi aplikasi sesuai preferensi Anda
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tampilan</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onThemeChange('light')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sun size={20} className="text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Terang</p>
                <p className="text-xs text-slate-500">Mode terang</p>
              </div>
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Moon size={20} className="text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Gelap</p>
                <p className="text-xs text-slate-500">Mode gelap</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Data</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Download size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Export Data</p>
                <p className="text-xs text-slate-500">Unduh semua tugas dalam format JSON</p>
              </div>
            </button>

            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <RotateCcw size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Reset Data</p>
                <p className="text-xs text-slate-500">Kembalikan ke data contoh default</p>
              </div>
            </button>

            <button
              onClick={handleClearAll}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Hapus Semua</p>
                <p className="text-xs text-slate-500">Hapus semua tugas secara permanen</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Statistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
              <p className="text-xs text-slate-500 mt-1">Total Tugas</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {tasks.filter((t) => t.status === 'done').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Selesai</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {tasks.filter((t) => t.status === 'in-progress').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Dalam Proses</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {tasks.filter((t) => t.status === 'review').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Review</p>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <h3 className="font-bold text-lg mb-2">TaskFlow ⚡</h3>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Aplikasi manajemen tugas modern untuk meningkatkan produktivitas Anda.
            Dibuat dengan React, TypeScript, Tailwind CSS, dan berbagai library populer.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Recharts', 'DnD Kit'].map((tech) => (
              <span key={tech} className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

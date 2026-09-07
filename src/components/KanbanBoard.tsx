import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { Plus, X, GripVertical, Calendar, Tag } from 'lucide-react';
import { Task, TaskStatus, Priority } from '../types';
import { createTask } from '../store';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const columns: { id: TaskStatus; title: string; color: string; emoji: string }[] = [
  { id: 'todo', title: 'To Do', color: 'border-slate-300 dark:border-slate-600', emoji: '📋' },
  { id: 'in-progress', title: 'In Progress', color: 'border-indigo-400', emoji: '⚡' },
  { id: 'review', title: 'Review', color: 'border-amber-400', emoji: '🔍' },
  { id: 'done', title: 'Done', color: 'border-emerald-400', emoji: '✅' },
];

const priorityColors: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function DraggableTask({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(task)}
      className={`bg-white dark:bg-slate-800 rounded-xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group ${
        isDragging ? 'opacity-50 shadow-xl scale-105' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="text-slate-300 dark:text-slate-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Calendar size={10} />
                {format(new Date(task.dueDate), 'dd MMM')}
              </span>
            )}
            {task.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="flex items-center gap-0.5 text-[10px] text-slate-400">
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[200px] rounded-xl p-2 transition-colors ${
        isOver ? 'bg-indigo-50 dark:bg-indigo-950/20' : ''
      }`}
    >
      {children}
    </div>
  );
}

export default function KanbanBoard({ tasks, onTasksChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formStatus, setFormStatus] = useState<TaskStatus>('todo');

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === active.id);
    if (!task || task.status === newStatus) return;

    const updatedTasks = tasks.map((t) =>
      t.id === active.id
        ? {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date().toISOString() : null,
          }
        : t
    );
    onTasksChange(updatedTasks);

    if (newStatus === 'done') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#6366f1', '#f59e0b'],
      });
    }
  };

  const openNewTask = (status: TaskStatus) => {
    setEditingTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormPriority('medium');
    setFormDueDate('');
    setFormStatus(status);
    setShowModal(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormPriority(task.priority);
    setFormDueDate(task.dueDate || '');
    setFormStatus(task.status);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: formTitle,
              description: formDesc,
              priority: formPriority,
              dueDate: formDueDate || null,
              status: formStatus,
              completedAt: formStatus === 'done' && !t.completedAt ? new Date().toISOString() : formStatus !== 'done' ? null : t.completedAt,
            }
          : t
      );
      onTasksChange(updated);
    } else {
      const newTask = createTask({
        title: formTitle,
        description: formDesc,
        priority: formPriority,
        dueDate: formDueDate || null,
        status: formStatus,
      });
      onTasksChange([...tasks, newTask]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!editingTask) return;
    onTasksChange(tasks.filter((t) => t.id !== editingTask.id));
    setShowModal(false);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kanban Board</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola tugas dengan drag & drop
          </p>
        </div>
        <button
          onClick={() => openNewTask('todo')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <Plus size={16} />
          Tambah Tugas
        </button>
      </div>

      {/* Board */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-2 py-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span>{col.emoji}</span>
                    <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                      {col.title}
                    </h3>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openNewTask(col.id)}
                    className="w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <DroppableColumn id={col.id}>
                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <DraggableTask key={task.id} task={task} onEdit={openEditTask} />
                    ))}
                  </div>
                </DroppableColumn>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 shadow-2xl border border-slate-200 dark:border-slate-600 w-64 rotate-3">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {activeTask.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingTask ? 'Edit Tugas' : 'Tugas Baru'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan judul tugas..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                    Deskripsi
                  </label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Deskripsi tugas..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Prioritas
                    </label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as Priority)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                {editingTask && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    Hapus
                  </button>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                  {editingTask ? 'Simpan' : 'Buat Tugas'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

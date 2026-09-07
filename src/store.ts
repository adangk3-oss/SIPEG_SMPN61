import { Task, Project, TaskStatus, Priority } from './types';
import { v4 as uuidv4 } from 'uuid';

const TASKS_KEY = 'taskflow_tasks';
const PROJECTS_KEY = 'taskflow_projects';
const THEME_KEY = 'taskflow_theme';

export function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return getDefaultTasks();
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return getDefaultProjects();
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const data = localStorage.getItem(THEME_KEY);
    if (data === 'dark') return 'dark';
  } catch {}
  return 'light';
}

export function saveTheme(theme: 'light' | 'dark') {
  localStorage.setItem(THEME_KEY, theme);
}

export function createTask(partial: Partial<Task> = {}): Task {
  return {
    id: uuidv4(),
    title: partial.title || 'New Task',
    description: partial.description || '',
    status: partial.status || 'todo',
    priority: partial.priority || 'medium',
    dueDate: partial.dueDate || null,
    tags: partial.tags || [],
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

export function getDefaultTasks(): Task[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0];
  const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

  return [
    {
      id: uuidv4(),
      title: 'Desain halaman landing page',
      description: 'Membuat wireframe dan mockup untuk halaman utama produk',
      status: 'done',
      priority: 'high',
      dueDate: yesterday,
      tags: ['design', 'ui'],
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      completedAt: yesterday,
    },
    {
      id: uuidv4(),
      title: 'Implementasi API autentikasi',
      description: 'Membuat endpoint login, register, dan refresh token',
      status: 'in-progress',
      priority: 'urgent',
      dueDate: today,
      tags: ['backend', 'api'],
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      completedAt: null,
    },
    {
      id: uuidv4(),
      title: 'Setup database schema',
      description: 'Membuat tabel users, tasks, dan projects di PostgreSQL',
      status: 'done',
      priority: 'high',
      dueDate: yesterday,
      tags: ['backend', 'database'],
      createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
      completedAt: yesterday,
    },
    {
      id: uuidv4(),
      title: 'Tulis unit test untuk komponen',
      description: 'Testing komponen React dengan Jest dan React Testing Library',
      status: 'todo',
      priority: 'medium',
      dueDate: tomorrow,
      tags: ['testing', 'frontend'],
      createdAt: now.toISOString(),
      completedAt: null,
    },
    {
      id: uuidv4(),
      title: 'Optimasi performa website',
      description: 'Lazy loading, code splitting, dan optimasi gambar',
      status: 'todo',
      priority: 'medium',
      dueDate: nextWeek,
      tags: ['performance', 'frontend'],
      createdAt: now.toISOString(),
      completedAt: null,
    },
    {
      id: uuidv4(),
      title: 'Review pull request #42',
      description: 'Review kode untuk fitur notifikasi real-time',
      status: 'review',
      priority: 'high',
      dueDate: today,
      tags: ['review', 'team'],
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      completedAt: null,
    },
    {
      id: uuidv4(),
      title: 'Dokumentasi API',
      description: 'Membuat dokumentasi Swagger untuk semua endpoint',
      status: 'todo',
      priority: 'low',
      dueDate: nextWeek,
      tags: ['docs', 'api'],
      createdAt: now.toISOString(),
      completedAt: null,
    },
    {
      id: uuidv4(),
      title: 'Deploy ke staging server',
      description: 'Setup CI/CD pipeline dan deploy versi terbaru',
      status: 'in-progress',
      priority: 'high',
      dueDate: tomorrow,
      tags: ['devops', 'deploy'],
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      completedAt: null,
    },
  ];
}

export function getDefaultProjects(): Project[] {
  return [
    { id: uuidv4(), name: 'Website Redesign', color: '#6366f1', icon: '🎨' },
    { id: uuidv4(), name: 'Mobile App', color: '#10b981', icon: '📱' },
    { id: uuidv4(), name: 'Marketing Campaign', color: '#f59e0b', icon: '📢' },
  ];
}

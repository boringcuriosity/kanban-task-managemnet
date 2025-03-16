import { create } from 'zustand';
import { Task, Column, User, Label } from '../types';

interface BoardState {
  columns: Column[];
  users: User[];
  labels: Label[];
  setColumns: (columns: Column[]) => void;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  addTask: (columnId: string, task: Omit<Task, 'id' | 'columnId'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string, columnId: string) => void;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
  },
];

const initialLabels: Label[] = [
  { id: '1', name: 'Bug', color: '#EF4444' },
  { id: '2', name: 'Feature', color: '#10B981' },
  { id: '3', name: 'Enhancement', color: '#6366F1' },
];

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Implement authentication',
        description: 'Add user authentication using JWT',
        assigneeId: '1',
        dueDate: '2024-03-20',
        priority: 'high',
        labels: [initialLabels[1]],
        comments: [],
        columnId: 'todo',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [],
  },
  {
    id: 'testing',
    title: 'Testing',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
  },
];

export const useBoardStore = create<BoardState>((set) => ({
  columns: initialColumns,
  users: initialUsers,
  labels: initialLabels,
  setColumns: (columns) => set({ columns }),
  moveTask: (taskId, fromColumnId, toColumnId) =>
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          };
        }
        if (col.id === toColumnId) {
          const task = state.columns
            .find((c) => c.id === fromColumnId)
            ?.tasks.find((t) => t.id === taskId);
          if (task) {
            const updatedTask = { ...task, columnId: toColumnId };
            return {
              ...col,
              tasks: [...col.tasks, updatedTask],
            };
          }
        }
        return col;
      });
      return { columns: newColumns };
    }),
  addTask: (columnId, taskData) =>
    set((state) => {
      const taskId = Math.random().toString(36).substring(2, 11);
      const newTask: Task = {
        ...taskData,
        id: taskId,
        columnId,
      };

      return {
        columns: state.columns.map((col) =>
          col.id === columnId
            ? { ...col, tasks: [newTask, ...col.tasks] }
            : col
        ),
      };
    }),
  updateTask: (taskId, updates) =>
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      })),
    })),
  deleteTask: (taskId, columnId) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      ),
    })),
}));
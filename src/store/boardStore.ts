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
  {
    id: '3',
    name: 'Alice Johnson',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuXP3aJOe16ND4gFo8IVCY6bP32inQOmpb4g&s',
  },
  {
    id: '4',
    name: 'Bob Brown',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=32&h=32&fit=crop&crop=face',
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
      {
        id: '2',
        title: 'Design landing page',
        description: 'Create a responsive design for the landing page',
        assigneeId: '2',
        dueDate: '2024-03-25',
        priority: 'medium',
        labels: [initialLabels[2]],
        comments: [],
        columnId: 'todo',
      },
      {
        id: '6',
        title: 'Set up database schema',
        description: 'Design and implement the database schema for the application',
        assigneeId: '3',
        dueDate: '2024-03-28',
        priority: 'high',
        labels: [initialLabels[1]],
        comments: [],
        columnId: 'todo',
      },
      {
        id: '7',
        title: 'Create user onboarding flow',
        description: 'Develop the user onboarding flow with tutorials and tips',
        assigneeId: '4',
        dueDate: '2024-03-30',
        priority: 'medium',
        labels: [initialLabels[2]],
        comments: [],
        columnId: 'todo',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'Develop API endpoints',
        description: 'Create RESTful API endpoints for user management',
        assigneeId: '1',
        dueDate: '2024-03-22',
        priority: 'high',
        labels: [initialLabels[0]],
        comments: [],
        columnId: 'in-progress',
      },
      {
        id: '8',
        title: 'Integrate payment gateway',
        description: 'Integrate Stripe payment gateway for subscription management',
        assigneeId: '3',
        dueDate: '2024-03-27',
        priority: 'high',
        labels: [initialLabels[1]],
        comments: [],
        columnId: 'in-progress',
      },
    ],
  },
  {
    id: 'testing',
    title: 'Testing',
    tasks: [
      {
        id: '4',
        title: 'Test authentication module',
        description: 'Perform unit and integration tests on the authentication module',
        assigneeId: '2',
        dueDate: '2024-03-23',
        priority: 'high',
        labels: [initialLabels[0]],
        comments: [],
        columnId: 'testing',
      },
      {
        id: '9',
        title: 'Test API endpoints',
        description: 'Perform unit and integration tests on the API endpoints',
        assigneeId: '4',
        dueDate: '2024-03-29',
        priority: 'high',
        labels: [initialLabels[0]],
        comments: [],
        columnId: 'testing',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: '5',
        title: 'Set up CI/CD pipeline',
        description: 'Configure continuous integration and deployment pipeline',
        assigneeId: '1',
        dueDate: '2024-03-18',
        priority: 'medium',
        labels: [initialLabels[2]],
        comments: [],
        columnId: 'done',
      },
    ],
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
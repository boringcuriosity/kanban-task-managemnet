export type Priority = 'low' | 'medium' | 'high';

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  dueDate: string | null;
  priority: Priority;
  labels: Label[];
  comments: Comment[];
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type User = {
  id: string;
  name: string;
  avatar: string;
};
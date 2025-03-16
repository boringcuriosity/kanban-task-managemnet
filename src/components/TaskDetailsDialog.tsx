import React, { useState, useEffect } from 'react';
import { Task, User, Label, Priority } from '../types';
import { X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailsDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  users: User[];
  labels: Label[];
}

export const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  users,
  labels,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                task.title
              )}
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-error hover:bg-error/10 rounded-md"
              title="Delete task"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={editedTask.description || ''}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              {isEditing ? (
                <select
                  value={editedTask.assigneeId || ''}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, assigneeId: e.target.value || null })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  {task.assigneeId ? (
                    <>
                      <img
                        src={users.find((u) => u.id === task.assigneeId)?.avatar}
                        alt="Assignee"
                        className="w-6 h-6 rounded-full"
                      />
                      <span>
                        {users.find((u) => u.id === task.assigneeId)?.name}
                      </span>
                    </>
                  ) : (
                    'Unassigned'
                  )}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.dueDate || ''}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, dueDate: e.target.value || null })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              ) : (
                <span>
                  {task.dueDate
                    ? format(new Date(task.dueDate), 'MMMM d, yyyy')
                    : 'No due date'}
                </span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              {isEditing ? (
                <select
                  value={editedTask.priority || task.priority}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      priority: e.target.value as Priority,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <span
                  className={`capitalize ${
                    task.priority === 'high'
                      ? 'text-error'
                      : task.priority === 'medium'
                      ? 'text-secondary'
                      : 'text-accent'
                  }`}
                >
                  {task.priority}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Labels
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => {
                      const currentLabels = editedTask.labels || task.labels;
                      const hasLabel = currentLabels.some((l) => l.id === label.id);
                      setEditedTask({
                        ...editedTask,
                        labels: hasLabel
                          ? currentLabels.filter((l) => l.id !== label.id)
                          : [...currentLabels, label],
                      });
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (editedTask.labels || task.labels).some(
                        (l) => l.id === label.id
                      )
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <span
                    key={label.id}
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${label.color}10`,
                      color: label.color,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
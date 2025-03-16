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
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content fixed inset-0 overflow-hidden flex items-center justify-center p-4 sm:p-6 z-50"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-2xl" />
          <div className="relative p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTask.title || ''}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      className="w-full px-2 py-1 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    />
                  ) : (
                    task.title
                  )}
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm px-3 py-1 rounded-lg bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-error/90 hover:bg-error/10 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={editedTask.description || ''}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-600 whitespace-pre-wrap bg-gray-50/50 rounded-lg px-3 py-2">
                    {task.description || 'No description provided.'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  {isEditing ? (
                    <select
                      value={editedTask.assigneeId || ''}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, assigneeId: e.target.value || null })
                      }
                      className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-2 rounded-lg">
                      {task.assigneeId ? (
                        <>
                          <img
                            src={users.find((u) => u.id === task.assigneeId)?.avatar}
                            alt="Assignee"
                            className="w-6 h-6 rounded-full ring-2 ring-white/80"
                          />
                          <span className="text-gray-700">
                            {users.find((u) => u.id === task.assigneeId)?.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Unassigned</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedTask.dueDate || ''}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, dueDate: e.target.value || null })
                      }
                      className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    />
                  ) : (
                    <div className="bg-gray-50/50 px-3 py-2 rounded-lg text-gray-700">
                      {task.dueDate
                        ? format(new Date(task.dueDate), 'MMMM d, yyyy')
                        : 'No due date'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    <div className="bg-gray-50/50 px-3 py-2 rounded-lg">
                      <span
                        className={`capitalize font-medium ${
                          task.priority === 'high'
                            ? 'text-error/90'
                            : task.priority === 'medium'
                            ? 'text-secondary/90'
                            : 'text-accent/90'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labels
                </label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50/50 rounded-lg">
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
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          (editedTask.labels || task.labels).some(
                            (l) => l.id === label.id
                          )
                            ? 'bg-primary/90 text-white'
                            : 'bg-white/80 text-gray-700 hover:bg-gray-100/80'
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
                          backgroundColor: `${label.color}08`,
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
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary px-4 py-2 text-sm font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary px-4 py-2 text-sm font-medium rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
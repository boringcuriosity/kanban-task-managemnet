import React from 'react';
import { Task, User } from '../types';
import { Calendar, Clock, MessageSquare, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  users: User[];
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, users, onClick }) => {
  const assignee = users.find((user) => user.id === task.assigneeId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card bg-white/80 rounded-lg border border-gray-100/50 backdrop-blur-sm ${
        isDragging ? 'dragging shadow-2xl rotate-2' : ''
      }`}
    >
      <div className="flex items-center group">
        <div
          {...attributes}
          {...listeners}
          className="drag-handle py-2 pl-2 pr-1 cursor-grab hover:bg-gray-50/80 rounded-l-lg select-none"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="w-5 h-10 flex items-center justify-center">
            <GripVertical 
              size={16} 
              className="text-gray-300 group-hover:text-gray-400 transition-colors" 
              style={{ 
                filter: isDragging ? 'none' : 'grayscale(1)',
                transform: isDragging ? 'rotate(0deg)' : 'none'
              }}
            />
          </div>
        </div>
        
        <div 
          className="flex-1 cursor-pointer select-none" 
          onClick={handleClick}
          style={{
            opacity: isDragging ? 0.6 : 1,
          }}
        >
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-gray-900">
                {task.title}
              </h3>
              {assignee && (
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full ring-2 ring-white/80 shadow-sm"
                  title={assignee.name}
                />
              )}
            </div>
            {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {task.labels.map((label) => (
                  <span
                    key={label.id}
                    className="label-chip px-2 py-0.5 text-xs font-medium rounded-full"
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
          <div className="px-3 py-2 border-t border-gray-100/50 bg-gray-50/30 rounded-b-lg">
            <div className="flex items-center gap-4 text-gray-500 text-xs">
              {task.dueDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" />
                  <span className="text-gray-600">{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
              {task.comments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-gray-400" />
                  <span className="text-gray-600">{task.comments.length}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 ml-auto">
                <Clock size={13} className="text-gray-400" />
                <span className={`capitalize font-medium ${
                  task.priority === 'high' ? 'text-error/90' :
                  task.priority === 'medium' ? 'text-secondary/90' :
                  'text-accent/90'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
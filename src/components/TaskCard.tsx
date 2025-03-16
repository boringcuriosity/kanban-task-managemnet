import React from 'react';
import { Task, User } from '../types';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {task.title}
          </h3>
          {assignee && (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full ring-2 ring-white"
              title={assignee.name}
            />
          )}
        </div>
        
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.labels.map((label) => (
              <span
                key={label.id}
                className="px-2 py-0.5 text-xs font-medium rounded-full"
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
      
      <div className="px-3 py-2 border-t border-gray-50 bg-gray-50/50 rounded-b-lg">
        <div className="flex items-center gap-3 text-gray-500 text-xs">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>{task.comments.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Clock size={14} />
            <span className={`capitalize font-medium ${
              task.priority === 'high' ? 'text-error' :
              task.priority === 'medium' ? 'text-secondary' :
              'text-accent'
            }`}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
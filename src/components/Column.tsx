import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, User, Task } from '../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  users: User[];
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

export const Column: React.FC<ColumnProps> = ({ 
  column, 
  users, 
  onAddTask,
  onTaskClick 
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-shrink-0 w-80 bg-gray-50/80 backdrop-blur-sm rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-gray-900">
            {column.title}
          </h2>
          <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Add task"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex flex-col gap-3 min-h-[200px]"
      >
        <SortableContext
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              users={users}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
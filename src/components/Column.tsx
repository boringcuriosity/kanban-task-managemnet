import React, { useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  animateLayoutChanges,
} from '@dnd-kit/sortable';
import { Column as ColumnType, User, Task } from '../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  users: User[];
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

const defaultAnimateLayoutChanges: any = (args: any) => {
  const { isSorting, wasSorting } = args;
  if (isSorting || wasSorting) return true;
  return true;
};

export const Column: React.FC<ColumnProps> = ({ 
  column, 
  users, 
  onAddTask,
  onTaskClick 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Enable smooth scrolling during touch interactions
      if (columnRef.current) {
        columnRef.current.style.overscrollBehavior = 'contain';
      }
    };

    const handleTouchEnd = () => {
      if (columnRef.current) {
        columnRef.current.style.overscrollBehavior = 'auto';
      }
    };

    const element = columnRef.current;
    element?.addEventListener('touchstart', handleTouchStart);
    element?.addEventListener('touchend', handleTouchEnd);

    return () => {
      element?.removeEventListener('touchstart', handleTouchStart);
      element?.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      className={`kanban-column flex-shrink-0 w-80 rounded-xl p-3 ${
        isOver ? 'drop-active' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-gray-900">
            {column.title}
          </h2>
          <span className="task-count px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100/80 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 active:bg-gray-200/60 rounded-md transition-colors"
          title={`Add task to ${column.title}`}
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div
        ref={(node) => {
          setNodeRef(node);
          if (columnRef) columnRef.current = node;
        }}
        className="flex flex-col gap-2.5 min-h-[200px] p-0.5 transition-all duration-200 touch-pan-y"
        style={{
          filter: isOver ? 'brightness(1.02)' : 'none',
          transform: isOver ? 'scale(1.01)' : 'none',
        }}
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
          {column.tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200/50 rounded-lg">
              <p className="text-sm text-gray-400">Drop tasks here</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
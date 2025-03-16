import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Column } from './components/Column';
import { TaskDialog } from './components/TaskDialog';
import { TaskDetailsDialog } from './components/TaskDetailsDialog';
import { useBoardStore } from './store/boardStore';
import { Layout, Plus } from 'lucide-react';
import { Task } from './types';

function App() {
  const { columns, users, labels, moveTask, addTask, updateTask, deleteTask } = useBoardStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Configure DnD sensors with activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Add dragging class to body for potential global styling
    document.body.classList.add('is-dragging');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );
    const overColumn = columns.find((col) => col.id === overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    // Scroll container if dragging near edges
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollSpeed = 10;

      if (event.clientX < containerRect.left + 100) {
        container.scrollLeft -= scrollSpeed;
      } else if (event.clientX > containerRect.right - 100) {
        container.scrollLeft += scrollSpeed;
      }
    }

    moveTask(activeId, activeColumn.id, overColumn.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    document.body.classList.remove('is-dragging');
  };

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsTaskDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
    const updatedTask = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);
    if (updatedTask) {
      setSelectedTask({ ...updatedTask, ...updates });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    const column = columns.find((col) => 
      col.tasks.some((task) => task.id === taskId)
    );
    if (column) {
      deleteTask(taskId, column.id);
      setSelectedTask(null);
      setIsTaskDetailsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 to-gray-100/80">
      <header className="bg-white/70 border-b border-gray-100/50 sticky top-0 z-10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Layout className="h-6 w-6 text-primary/90" />
              <h1 className="ml-2.5 text-lg font-semibold text-gray-800 whitespace-nowrap">
                Modern Kanban
              </h1>
            </div>
            <button
              onClick={() => {
                setSelectedColumnId('todo');
                setIsTaskDialogOpen(true);
              }}
              className="btn-primary inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 snap-x scroll-smooth scrollbar-hidden -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {columns.map((column) => (
                <div key={column.id} className="snap-start first:pl-0 last:pr-4 sm:last:pr-0">
                  <Column
                    column={column}
                    users={users}
                    onAddTask={handleAddTask}
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-0 left-4 right-4 h-1 bg-gray-100/50 rounded-full hidden sm:block">
              <div 
                className="h-full bg-primary/20 rounded-full transition-all duration-300"
                style={{
                  width: scrollContainerRef.current 
                    ? `${(scrollContainerRef.current.scrollLeft / (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth)) * 100}%`
                    : '0%',
                  transform: `translateX(${scrollContainerRef.current?.scrollLeft || 0}px)`,
                }}
              />
            </div>
          </div>
        </DndContext>
      </main>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSave={(task) => {
          if (selectedColumnId) {
            addTask(selectedColumnId, task);
            setIsTaskDialogOpen(false);
          }
        }}
        users={users}
        labels={labels}
      />

      <TaskDetailsDialog
        isOpen={isTaskDetailsOpen}
        task={selectedTask}
        onClose={() => {
          setIsTaskDetailsOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        users={users}
        labels={labels}
      />
    </div>
  );
}

export default App;
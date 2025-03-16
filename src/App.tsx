import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
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

  const handleDragStart = (event: DragStartEvent) => {
    // We'll keep track of the dragging task in the DnD context
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

    moveTask(activeId, activeColumn.id, overColumn.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // We'll reset the dragging task in the DnD context
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Layout className="h-7 w-7 text-primary" />
              <h1 className="ml-2.5 text-lg font-semibold text-gray-900">
                Modern Kanban
              </h1>
            </div>
            <button
              onClick={() => {
                setSelectedColumnId('todo');
                setIsTaskDialogOpen(true);
              }}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
            {columns.map((column) => (
              <div key={column.id} className="snap-start">
                <Column
                  column={column}
                  users={users}
                  onAddTask={handleAddTask}
                  onTaskClick={handleTaskClick}
                />
              </div>
            ))}
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
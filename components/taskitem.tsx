'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps): JSX.Element {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleToggleComplete = async (): Promise<void> => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: task.id,
          completed: !task.completed,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onTaskUpdated(result.data);
      } else {
        console.error('Failed to update task:', result.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onTaskDeleted(task.id);
      } else {
        console.error('Failed to delete task:', result.error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`w-full transition-opacity ${isDeleting ? 'opacity-50' : ''}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3 flex-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isUpdating}
            className="flex-shrink-0"
          />
          <span 
            className={`flex-1 ${
              task.completed 
                ? 'line-through text-gray-500' 
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
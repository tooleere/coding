'use client';

import { useState } from 'react';
import type { Task } from '@/types/task';

interface TaskFormProps {
  onTaskAdded: (task: Task) => void;
}

export function TaskForm({ onTaskAdded }: TaskFormProps): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a task');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        onTaskAdded(result.data);
        setTitle('');
      } else {
        setError(result.error || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border rounded-md p-4 bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !title.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}

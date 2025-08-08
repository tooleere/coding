'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !title.trim()}
              className="px-6"
            >
              {isLoading ? 'Adding...' : 'Add Task'}
            </Button>
          </div>
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
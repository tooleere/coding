'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Loader2 } from 'lucide-react';
import type { Task } from '@/types/task';

export default function Page(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Load tasks when component mounts
  useEffect(() => {
    const fetchTasks = async (): Promise<void> => {
      try {
        const response = await fetch('/api/tasks');
        const result = await response.json();

        if (result.success) {
          setTasks(result.data);
        } else {
          setError(result.error || 'Failed to load tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks. Please refresh and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask: Task): void => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask: Task): void => {
    setTasks(prev => 
      prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDeleted = (taskId: string): void => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <p className="text-gray-600">Stay organized and get things done!</p>
        </div>

        {/* Progress Summary */}
        {totalCount > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedCount} of {totalCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Task Form */}
        <TaskForm onTaskAdded={handleTaskAdded} />

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading tasks...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-2">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Refresh page
                </button>
              </div>
            ) : (
              <TaskList 
                tasks={tasks}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Task {
  id: string;
  type: string;
  related_id: string;
  due_at: string;
  status: string | null;
}

// Environment variables - replace with your actual values
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client once (outside component to avoid multiple instances)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function TodayPage() {
  const queryClient = useQueryClient();

  // Get today's date range (start and end of day)
  const getTodayRange = () => {
    const today = new Date();
    // Get today's date in YYYY-MM-DD format
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    return { todayDate };
  };

  // Fetch tasks due today
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ['tasks-today'],
    queryFn: async () => {
      const { todayDate } = getTodayRange();
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .gte('due_at', `${todayDate}T00:00:00`)
        .lt('due_at', `${todayDate}T23:59:59`)
        .order('due_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Mutation for marking task as complete
  const markCompleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch tasks after successful update
      queryClient.invalidateQueries({ queryKey: ['tasks-today'] });
    },
  });

  // Handle mark complete button click
  const handleMarkComplete = (taskId: string) => {
    markCompleteMutation.mutate(taskId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error Loading Tasks</h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">No tasks due today</h2>
          <p className="mt-2 text-gray-600">You're all caught up! Enjoy your day.</p>
        </div>
      </div>
    );
  }

  // Main table view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tasks Due Today</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{task.related_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{formatDate(task.due_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleMarkComplete(task.id)}
                      disabled={
                        task.status === 'completed' ||
                        markCompleteMutation.isPending
                      }
                      className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        task.status === 'completed'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                      } ${
                        markCompleteMutation.isPending
                          ? 'opacity-50 cursor-wait'
                          : ''
                      }`}
                    >
                      {markCompleteMutation.isPending
                        ? 'Updating...'
                        : task.status === 'completed'
                        ? 'Completed'
                        : 'Mark Complete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary footer */}
      <div className="mt-4 text-sm text-gray-600">
        Total tasks due today: {tasks.length}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { taskAPI } from '../../services/api';

interface Task {
    taskId: string;
    title: string;
    description: string;
    dueDate: any;
    priority: string;
    status: string;
    category: string;
    tags: string[];
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await taskAPI.getTasks(10);
            setTasks(response.tasks || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return '🔴';
            case 'medium':
                return '🟡';
            default:
                return '🟢';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            </div>

            <div className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No tasks found
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.taskId} className="p-4 hover:bg-gray-50 transition">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {task.title}
                                        </h3>
                                        <span
                                            className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                                                task.status
                                            )}`}
                                        >
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                                        <span>📁 {task.category}</span>
                                        <span>
                                            📅 Due: {new Date(task.dueDate?.seconds * 1000 || task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        {task.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;

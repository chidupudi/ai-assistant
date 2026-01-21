import React, { useEffect, useState } from 'react';
import { emailAPI } from '../../services/api';

interface Email {
    emailId: string;
    subject: string;
    sender: {
        name: string;
        email: string;
    };
    bodyPreview: string;
    receivedAt: any;
    priority: string;
    isRead: boolean;
    labels: string[];
}

const EmailSummary: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEmails();
    }, []);

    const loadEmails = async () => {
        try {
            const response = await emailAPI.getEmails(10);
            setEmails(response.emails || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load emails');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
            case 'medium':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
            default:
                return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return '🔥';
            case 'medium':
                return '⚡';
            default:
                return '✅';
        }
    };

    if (loading) {
        return (
            <div className="glass-effect rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-effect rounded-2xl p-6 animate-scale-in">
                <div className="text-red-600 flex items-center space-x-2">
                    <span className="text-2xl">⚠️</span>
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-effect rounded-2xl overflow-hidden shadow-xl animate-scale-in">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">📧</span>
                    <h2 className="text-xl font-bold">Recent Emails</h2>
                </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {emails.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-6xl mb-4 animate-bounce">📭</div>
                        <p className="text-gray-500 font-medium">No emails found</p>
                    </div>
                ) : (
                    emails.map((email, index) => (
                        <div
                            key={email.emailId}
                            className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer group card-hover ${!email.isRead ? 'bg-blue-50/50' : ''
                                }`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        {!email.isRead && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        )}
                                        <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                            {email.subject}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getPriorityColor(email.priority)}`}>
                                            <span className="mr-1">{getPriorityIcon(email.priority)}</span>
                                            {email.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center space-x-2">
                                        <span className="font-semibold">{email.sender.name}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500">{email.sender.email}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {email.bodyPreview}
                                    </p>
                                    <div className="flex items-center flex-wrap gap-2">
                                        {email.labels.map((label) => (
                                            <span
                                                key={label}
                                                className="px-3 py-1 text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-medium border border-indigo-200"
                                            >
                                                #{label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="ml-4 text-xs text-gray-500 whitespace-nowrap flex flex-col items-end space-y-1">
                                    <span className="font-medium">
                                        {new Date(email.receivedAt?.seconds * 1000 || email.receivedAt).toLocaleDateString()}
                                    </span>
                                    <span className="text-gray-400">
                                        {new Date(email.receivedAt?.seconds * 1000 || email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmailSummary;

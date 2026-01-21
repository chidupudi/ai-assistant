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
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-100 rounded"></div>
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
                <h2 className="text-xl font-semibold text-gray-900">Recent Emails</h2>
            </div>

            <div className="divide-y divide-gray-200">
                {emails.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No emails found
                    </div>
                ) : (
                    emails.map((email) => (
                        <div
                            key={email.emailId}
                            className={`p-4 hover:bg-gray-50 transition ${!email.isRead ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {email.subject}
                                        </h3>
                                        <span
                                            className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                                                email.priority
                                            )}`}
                                        >
                                            {email.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        From: {email.sender.name} ({email.sender.email})
                                    </p>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {email.bodyPreview}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        {email.labels.map((label) => (
                                            <span
                                                key={label}
                                                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="ml-4 text-xs text-gray-500 whitespace-nowrap">
                                    {new Date(email.receivedAt?.seconds * 1000 || email.receivedAt).toLocaleDateString()}
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

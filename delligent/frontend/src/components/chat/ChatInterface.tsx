import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../../services/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sources?: Array<{
        type: string;
        id: string;
        title: string;
        relevance: number;
    }>;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(input, conversationId);

            if (!conversationId) {
                setConversationId(response.conversation_id);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.response,
                timestamp: new Date(response.timestamp),
                sources: response.context_sources,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Error: ${error.response?.data?.detail || 'Failed to get response'}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQueries = [
        "What urgent emails do I have today?",
        "Show me my high priority tasks",
        "What meetings do I have this week?",
        "Summarize my action items"
    ];

    return (
        <div className="flex flex-col h-full glass-effect rounded-2xl overflow-hidden animate-scale-in">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AI Assistant</h2>
                            <p className="text-sm text-blue-100">Ask me about your emails, tasks, and calendar</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center mt-12 animate-fade-in">
                        <div className="text-6xl mb-6 animate-bounce">💬</div>
                        <h3 className="text-2xl font-bold gradient-text mb-3">Start a conversation</h3>
                        <p className="text-gray-600 mb-6">Try asking me something:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                            {suggestedQueries.map((query, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(query)}
                                    className="text-left p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                                >
                                    <div className="flex items-start space-x-2">
                                        <span className="text-blue-600 mt-1 group-hover:scale-110 transition-transform">✨</span>
                                        <span className="text-sm text-gray-700 font-medium">{query}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`flex message-enter ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div
                            className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 hover:shadow-xl ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                                    : 'bg-white border border-gray-200'
                                }`}
                        >
                            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>

                            {message.sources && message.sources.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs font-semibold mb-2 text-gray-600 flex items-center">
                                        <span className="mr-1">📚</span> Sources:
                                    </p>
                                    <div className="space-y-2">
                                        {message.sources.map((source, idx) => (
                                            <div key={idx} className="text-xs bg-gray-50 rounded-lg p-2 flex items-center space-x-2">
                                                <span className="text-lg">
                                                    {source.type === 'email' ? '📧' : source.type === 'task' ? '✅' : '📅'}
                                                </span>
                                                <span className="text-gray-700 flex-1">{source.title}</span>
                                                <span className="text-gray-500">({source.type})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={`text-xs mt-3 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-slide-up">
                        <div className="bg-white rounded-2xl px-5 py-4 shadow-lg border border-gray-200">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input with modern styling */}
            <div className="border-t border-gray-200 p-4 bg-white/50 backdrop-blur-sm">
                <div className="flex space-x-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Press Enter to send)"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/80"
                        rows={2}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span className="flex items-center space-x-2">
                            <span>Send</span>
                            <span>✨</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;

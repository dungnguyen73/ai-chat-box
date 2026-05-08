import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import type { Message, ChatResponse } from '../chat/types';
import ChatMessages from '../chat/ChatMessages';
import ChatInput from '../chat/ChatInput';

const ChatBox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState<string>('');

    const conversationId = useRef(crypto.randomUUID());

    const handleSendMessage = async (content: string) => {
        try {
            setError('');
            setIsBotTyping(true);

            setMessages((prev) => [...prev, { content, role: 'user' }]);

            const { data: response }: { data: ChatResponse } = await axios.post(
                '/api/chat/gemini',
                {
                    prompt: content,
                    conversationId: conversationId.current,
                }
            );

            const aiMessage = response.message.message;
            setMessages((prev) => [
                ...prev,
                { content: aiMessage, role: 'model' },
            ]);
        } catch (err) {
            console.error('Chat error:', err);
            setError('Failed to get a response from the AI. Please try again.');

            setMessages((prev) => [
                ...prev,
                {
                    content:
                        '⚠️ Error: Something went wrong with the connection.',
                    role: 'model',
                },
            ]);
        } finally {
            setIsBotTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto my-4 w-full glass-morphism rounded-3xl shadow-2xl overflow-hidden border border-gray-100 bg-white/80 backdrop-blur-md">
            <header className="p-4 px-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-inner">
                            <span className="font-bold text-sm">AI</span>
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-800">
                            Gemini Assistant
                        </h1>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Always active
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMessages([])}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                        title="Clear conversation"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6">
                <ChatMessages
                    messages={messages}
                    isBotTyping={isBotTyping}
                    error={error}
                    onSelectPrompt={handleSendMessage}
                />
            </div>

            <footer className="p-4 md:p-6 pt-0">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isBotTyping}
                />
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    AI can make mistakes. Consider checking important
                    information.
                </p>
            </footer>
        </div>
    );
};

export default ChatBox;

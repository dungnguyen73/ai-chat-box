import React, { useEffect, useRef } from 'react';
import type { Message } from './types';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatMessagesProps {
    messages: Message[];
    isBotTyping: boolean;
    error?: string;
    onSelectPrompt?: (prompt: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
    messages,
    isBotTyping,
    error,
    onSelectPrompt,
}) => {
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isBotTyping]);

    const suggestedPrompts = [
        'Explain quantum computing in simple terms',
        'How do I make a perfect cup of coffee?',
        'Write a short story about a time-traveling toaster',
        'Give me 5 workout tips for beginners',
    ];

    return (
        <div className="flex flex-col gap-6 mb-8 overflow-y-auto pr-2 pb-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent h-full">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-10">
                    <div className="space-y-2">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            How can I help you today?
                        </h2>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            I'm your AI assistant, ready to help with writing,
                            coding, or just chatting.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full px-4">
                        {suggestedPrompts.map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => onSelectPrompt?.(prompt)}
                                className="flex items-center text-left p-4 min-h-[80px] text-xs leading-tight text-gray-600 border border-gray-100 bg-white hover:border-blue-300 hover:bg-blue-50 rounded-2xl transition-all shadow-sm active:scale-[0.98] w-full h-full"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={message}
                    isLast={index === messages.length - 1}
                    scrollRef={lastMessageRef}
                />
            ))}

            {isBotTyping && <TypingIndicator />}

            {error && (
                <div className="self-center my-4 p-4 bg-red-50 border border-red-100 rounded-2xl max-w-md shadow-sm">
                    <p className="text-red-600 text-sm font-medium flex items-center gap-3">
                        <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            ⚠️
                        </span>
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChatMessages;

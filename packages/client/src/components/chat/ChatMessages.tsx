import React from 'react';
import type { Message } from './types';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatMessagesProps {
    messages: Message[];
    isBotTyping: boolean;
    error?: string;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
    messages,
    isBotTyping,
    error,
    scrollRef,
}) => {
    return (
        <div className="flex flex-col gap-4 mb-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                    <p className="text-lg font-medium">Start a conversation!</p>
                    <p className="text-sm">Ask anything to get started.</p>
                </div>
            )}

            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={message}
                    isLast={index === messages.length - 1}
                    scrollRef={scrollRef}
                />
            ))}

            {isBotTyping && <TypingIndicator />}

            {error && (
                <div className="self-center my-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChatMessages;

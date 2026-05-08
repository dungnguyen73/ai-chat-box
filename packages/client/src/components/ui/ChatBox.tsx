import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import type { Message, ChatResponse } from '../chat/types';
import ChatMessages from '../chat/ChatMessages';
import ChatInput from '../chat/ChatInput';

const ChatBox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState<string>('');
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const conversationId = useRef(crypto.randomUUID());

    // Scroll to bottom on new messages
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isBotTyping]);

    const handleSendMessage = async (content: string) => {
        try {
            setError('');
            setIsBotTyping(true);

            // Optimistic update for user message
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

            // Optionally add the error message to the chat
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
        <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto w-full glass-morphism rounded-3xl shadow-2xl overflow-hidden border border-gray-100 bg-white/80 backdrop-blur-md">
            <header className="p-6 border-b border-gray-100 bg-linear-to-r from-blue-600 to-indigo-600 text-white"></header>

            <div className="flex-1 overflow-hidden flex flex-col p-6">
                <ChatMessages
                    messages={messages}
                    isBotTyping={isBotTyping}
                    error={error}
                    scrollRef={lastMessageRef}
                />
            </div>

            <footer className="p-6 pt-0">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isBotTyping}
                />
            </footer>
        </div>
    );
};

export default ChatBox;

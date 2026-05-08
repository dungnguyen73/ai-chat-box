import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type FormData = {
    prompt: string;
};

type ChatResponse = {
    data: {
        message: {
            message: string;
            id: string;
        };
        source: string;
    };
};

type Message = {
    content: string;
    role: 'user' | 'model';
};

const ChatBox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState<String>('');
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    const conversationId = useRef(crypto.randomUUID());
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    useEffect(() => {
        if (!lastMessageRef.current) return;
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsBotTyping(true);
            reset();

            setMessages((prevs) => [
                ...prevs,
                { content: data.prompt, role: 'user' },
            ]);

            const { data: response }: ChatResponse = await axios.post(
                '/api/chat/gemini',
                {
                    prompt: data.prompt,
                    conversationId: conversationId.current,
                }
            );

            const aiMessage = response.message.message;
            setMessages((prevs) => [
                ...prevs,
                { content: aiMessage, role: 'model' },
            ]);
            setIsBotTyping(false);
        } catch (err) {
            console.error(err);
            setMessages((prevs) => [
                ...prevs,
                { content: 'Something went wrong', role: 'model' },
            ]);
            setError('Something went wrong');
            setIsBotTyping(false);
        } finally {
            setIsBotTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const onCopyMessage = (e: React.ClipboardEvent) => {
        const selection = window.getSelection().toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selection);
        }
    };
    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] p-4">
            <div className="flex flex-col items-start gap-4 mb-8 overflow-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        ref={
                            index === messages.length - 1
                                ? lastMessageRef
                                : null
                        }
                        onCopy={onCopyMessage}
                        className={`w-fit p-4 rounded-2xl ${
                            message.role === 'user'
                                ? 'self-end bg-blue-500 text-white'
                                : 'self-start bg-gray-200 text-black'
                        }`}
                    >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
            </div>

            {isBotTyping && (
                <div className="flex self-start gap-2 px-3 py-3 mb-4 bg-gray-200 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-gray-600 text-gray-600 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600 text-gray-600 animate-bounce delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600 text-gray-600 animate-bounce delay-300"></div>
                </div>
            )}

            {error && (
                <div className="mb-4">
                    <p className="text-red-700">
                        Something went wrong, try again! {error}
                    </p>
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={handleKeyDown}
                className="flex flex-col gap-2 items-end border-2 p-4 border-gray-600 rounded-2xl"
            >
                <textarea
                    autoFocus
                    {...register('prompt', {
                        required: true,
                        validate: (data) => data.trim().length > 0,
                        maxLength: 1000,
                    })}
                    className="w-full p-4 focus:ring-0 outline-none"
                    placeholder="Type your message here..."
                />
                <Button
                    type="submit"
                    disabled={!formState.isValid || isBotTyping}
                    className="rounded-full w-9 h-9"
                >
                    <FaArrowUp />
                </Button>
            </form>
        </div>
    );
};

export default ChatBox;

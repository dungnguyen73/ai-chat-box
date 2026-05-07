import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useState } from 'react';
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
    // const [prompts, setPrompts] = useState<string[]>([]);
    const conversationId = useRef(crypto.randomUUID());
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
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
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div>
            <div className="flex flex-col items-start gap-4 mb-8">
                {messages.map((message, index) => (
                    <p
                        key={index}
                        className={`w-fit p-4 rounded-xl ${
                            message.role === 'user'
                                ? 'ml-auto bg-blue-500 text-white'
                                : 'mr-auto bg-gray-200 text-black'
                        }`}
                    >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </p>
                ))}
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={handleKeyDown}
                className="flex flex-col gap-2 items-end border-2 p-4 border-gray-600 rounded-2xl"
            >
                <textarea
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
                    disabled={!formState.isValid}
                    className="rounded-full w-9 h-9"
                >
                    <FaArrowUp />
                </Button>
            </form>
        </div>
    );
};

export default ChatBox;

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';

interface ChatInputProps {
    onSendMessage: (content: string) => Promise<void>;
    disabled?: boolean;
}

type FormData = {
    prompt: string;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        if (!data.prompt.trim()) return;
        const content = data.prompt;
        reset();
        await onSendMessage(content);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="group relative flex flex-col gap-2 items-end border-2 p-3 border-gray-200 rounded-2xl transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"
        >
            <textarea
                autoFocus
                {...register('prompt', {
                    required: true,
                    validate: (val) => val.trim().length > 0,
                    maxLength: 1000,
                })}
                onKeyDown={handleKeyDown}
                className="w-full p-2 min-h-[60px] max-h-[200px] bg-transparent focus:ring-0 outline-none resize-none text-gray-700 placeholder-gray-400"
                placeholder="Type your message here..."
                disabled={disabled}
            />
            <div className="flex justify-between items-center w-full px-2">
                <span className="text-[10px] text-gray-400">
                    Press Enter to send, Shift + Enter for new line
                </span>
                <Button
                    type="submit"
                    disabled={!formState.isValid || disabled}
                    className="rounded-full w-10 h-10 flex items-center justify-center p-0 transition-transform active:scale-95 disabled:bg-gray-200"
                >
                    <FaArrowUp className="w-4 h-4" />
                </Button>
            </div>
        </form>
    );
};

export default ChatInput;

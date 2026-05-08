import React, { useEffect, useRef } from 'react';
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
    const { register, handleSubmit, reset, watch, setValue } =
        useForm<FormData>({
            defaultValues: { prompt: '' },
        });

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const promptValue = watch('prompt');
    const { ref: registerRef, ...rest } = register('prompt', {
        required: true,
        validate: (val) => val.trim().length > 0,
        maxLength: 1000,
    });

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [promptValue]);

    const onSubmit = async (data: FormData) => {
        if (!data.prompt.trim()) return;
        const content = data.prompt;
        reset({ prompt: '' });
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
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
            className="group relative flex flex-col gap-2 items-end border-2 p-3 bg-white/50 backdrop-blur-sm border-gray-200 rounded-2xl transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 shadow-sm"
        >
            <textarea
                {...rest}
                ref={(e) => {
                    registerRef(e);
                    textareaRef.current = e;
                }}
                autoFocus
                onKeyDown={handleKeyDown}
                className="w-full p-2 min-h-[44px] max-h-[200px] bg-transparent focus:ring-0 outline-none resize-none text-gray-700 placeholder-gray-400 text-sm leading-relaxed"
                placeholder="Message AI Assistant..."
                disabled={disabled}
            />
            <div className="flex justify-between items-center w-full px-2 pb-1">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400">
                        {promptValue.length}/1000 characters
                    </span>
                    <span className="text-[9px] text-gray-300">
                        Shift + Enter for new line
                    </span>
                </div>
                <Button
                    type="submit"
                    disabled={!promptValue.trim() || disabled}
                    className={`rounded-xl w-10 h-10 flex items-center justify-center p-0 transition-all ${
                        promptValue.trim() && !disabled
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg translate-y-[-2px]'
                            : 'bg-gray-200'
                    }`}
                >
                    <FaArrowUp
                        className={`w-4 h-4 ${promptValue.trim() && !disabled ? 'text-white' : 'text-gray-400'}`}
                    />
                </Button>
            </div>
        </form>
    );
};

export default ChatInput;

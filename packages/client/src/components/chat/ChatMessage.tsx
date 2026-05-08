import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from './types';

interface ChatMessageProps {
    message: Message;
    isLast?: boolean;
    scrollRef?: React.RefObject<HTMLDivElement | null>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    isLast,
    scrollRef,
}) => {
    const onCopyMessage = (e: React.ClipboardEvent) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selection);
        }
    };

    const isUser = message.role === 'user';

    return (
        <div
            ref={isLast ? scrollRef : null}
            onCopy={onCopyMessage}
            className={`w-fit max-w-[85%] p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                isUser
                    ? 'self-end bg-blue-600 text-white rounded-tr-none'
                    : 'self-start bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
            }`}
        >
            <div
                className={`text-sm leading-relaxed wrap-break-word ${isUser ? 'text-blue-50' : 'text-gray-700'}`}
            >
                <ReactMarkdown
                    components={{
                        p: ({ node, ...props }) => (
                            <p className="mb-2 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                            <ul className="list-disc ml-4 mb-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="list-decimal ml-4 mb-2" {...props} />
                        ),
                        code: ({ node, ...props }) => (
                            <code
                                className="bg-gray-200 px-1 rounded text-xs font-mono"
                                {...props}
                            />
                        ),
                        pre: ({ node, ...props }) => (
                            <pre
                                className="bg-gray-900 text-gray-100 p-2 rounded-lg my-2 overflow-x-auto text-xs"
                                {...props}
                            />
                        ),
                    }}
                >
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default ChatMessage;

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
            className={`flex items-start gap-3 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                    isUser
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-linear-to-tr from-blue-500 to-indigo-600 text-white'
                }`}
            >
                {isUser ? 'ME' : 'AI'}
            </div>

            <div
                ref={isLast ? scrollRef : null}
                onCopy={onCopyMessage}
                className={`group relative w-fit max-w-[85%] p-3.5 rounded-2xl transition-all duration-200 hover:shadow-lg ${
                    isUser
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-200 shadow-md'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 pb-2 shadow-md'
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
                                <ul
                                    className="list-disc ml-4 mb-2"
                                    {...props}
                                />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol
                                    className="list-decimal ml-4 mb-2"
                                    {...props}
                                />
                            ),
                            code: ({ node, ...props }) => (
                                <code
                                    className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                                        isUser
                                            ? 'bg-blue-500/50 text-blue-50'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                    {...props}
                                />
                            ),
                            pre: ({ node, ...props }) => (
                                <pre
                                    className="bg-gray-900 text-gray-100 p-3 rounded-xl my-2 overflow-x-auto text-xs border border-gray-800 shadow-inner"
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                <div
                    className={`mt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                    {/* <span className="text-[9px] font-medium text-gray-400">
                        {new Date().toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span> */}
                    {!isUser && (
                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(message.content)
                            }
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-500 transition-colors"
                            title="Copy to clipboard"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;

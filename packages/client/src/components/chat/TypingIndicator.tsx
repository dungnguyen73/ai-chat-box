import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex self-start gap-2 px-4 py-3 mb-4 bg-gray-200 rounded-2xl animate-pulse">
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:0.4s]"></div>
        </div>
    );
};

export default TypingIndicator;

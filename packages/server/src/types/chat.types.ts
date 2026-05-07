export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
    role: MessageRole;
    content: string;
}

export interface ChatResponse {
    id: string;
    message: string;
}

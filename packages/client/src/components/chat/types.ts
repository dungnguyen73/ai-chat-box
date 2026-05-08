export type MessageRole = 'user' | 'model';

export interface Message {
    content: string;
    role: MessageRole;
}

export interface ChatResponse {
    message: {
        message: string;
        id: string;
    };
    source: string;
}

import type { ChatMessage } from '../types/chat.types';

export class ConversationRepository {
    private conversations = new Map<string, ChatMessage[]>();

    getHistory(id: string): ChatMessage[] {
        return this.conversations.get(id) || [];
    }

    saveHistory(id: string, history: ChatMessage[]) {
        this.conversations.set(id, history);
    }
}

export const conversationRepository = new ConversationRepository();

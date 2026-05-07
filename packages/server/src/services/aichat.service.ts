import { conversationRepository } from '../repositories/conversation.repository';
import { geminiModel, openaiClient } from '../config/ai.config';
import type { ChatMessage } from '../types/chat.types';
import type { Content } from '@google/generative-ai';
import { uuid } from 'zod';

type ChatResponse = {
    id: string;
    message: string;
};

export class AIChatService {
    async chatWithGemini(
        prompt: string,
        conversationId?: string,
        config?: { temperature?: number; maxTokens?: number }
    ): Promise<ChatResponse> {
        const genericHistory = conversationId
            ? conversationRepository.getHistory(conversationId)
            : [];

        // TRANSLATION: Generic -> Gemini Format
        const geminiHistory: Content[] = genericHistory.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        const chatSession = geminiModel.startChat({
            history: geminiHistory,
            generationConfig: {
                temperature: config?.temperature ?? 0.2,
                maxOutputTokens: config?.maxTokens ?? 1000,
            },
        });

        const result = await chatSession.sendMessage(prompt);
        const text = result.response.text();

        if (conversationId) {
            const updatedHistory: ChatMessage[] = [
                ...genericHistory,
                { role: 'user', content: prompt },
                { role: 'assistant', content: text },
            ];
            conversationRepository.saveHistory(conversationId, updatedHistory);
        }

        return {
            id: uuid().toString(),
            message: text,
        };
    }

    async chatWithOpenAI(
        prompt: string,
        conversationId?: string
    ): Promise<ChatResponse> {
        const genericHistory = conversationId
            ? conversationRepository.getHistory(conversationId)
            : [];

        // TRANSLATION: Generic -> OpenAI Format
        const openaiMessages: any[] = genericHistory.map((msg) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
        }));

        // Add current prompt
        openaiMessages.push({ role: 'user', content: prompt });

        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: openaiMessages,
        });

        const text = response.choices[0]?.message.content ?? '';

        if (conversationId) {
            const updatedHistory: ChatMessage[] = [
                ...genericHistory,
                { role: 'user', content: prompt },
                { role: 'assistant', content: text },
            ];
            conversationRepository.saveHistory(conversationId, updatedHistory);
        }

        return {
            id: response.id,
            message: text,
        };
    }
}

export const aichatService = new AIChatService();

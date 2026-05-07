import type { Request, Response } from 'express';
import { aichatService } from '../services/aichat.service';
import z from 'zod';

const chatSchema = z.object({
    prompt: z.string().trim().min(1).max(500),
    temperature: z.number().min(0).max(1).optional(),
    maxTokens: z.number().min(1).optional(),
    conversationId: z.string().uuid(),
});

export class AIChatController {
    handleGemini = async (req: Request, res: Response) => {
        const parseResult = chatSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                details: parseResult.error.issues,
            });
        }

        const { prompt, temperature, maxTokens, conversationId } =
            parseResult.data;

        try {
            const message = await aichatService.chatWithGemini(
                prompt,
                conversationId,
                { temperature, maxTokens }
            );
            res.json({ source: 'gemini', message });
        } catch (error) {
            console.error('Gemini Controller Error:', error);
            res.status(500).json({ error: 'Gemini error' });
        }
    };

    handleOpenAI = async (req: Request, res: Response) => {
        const parseResult = chatSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                details: parseResult.error.issues,
            });
        }

        const { prompt, conversationId } = parseResult.data;
        try {
            const message = await aichatService.chatWithOpenAI(prompt);
            res.json({ source: 'openai', message });
        } catch (error) {
            console.error('OpenAI Controller Error:', error);
            res.status(500).json({ error: 'OpenAI error' });
        }
    };
}

export const aiChatController = new AIChatController();

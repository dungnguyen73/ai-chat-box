import type { Request, Response } from 'express';
import { aichatService } from '../services/aichat.service';

export class AIController {
    handleGemini = async (req: Request, res: Response) => {
        const { prompt, conversationId, temperature, maxTokens } = req.body;
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
        const { prompt } = req.body;
        try {
            const message = await aichatService.chatWithOpenAI(prompt);
            res.json({ source: 'openai', message });
        } catch (error) {
            console.error('OpenAI Controller Error:', error);
            res.status(500).json({ error: 'OpenAI error' });
        }
    };
}

export const aiController = new AIController();

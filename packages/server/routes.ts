import express from 'express';
import type { Request, Response } from 'express';
import * as process from 'node:process';
import { aiChatController } from './src/controllers/aichat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) =>
    res.send('AI API Server is running')
);

router.get('/api/health', (req: Request, res: Response) => {
    res.send({
        message: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

router.post('/api/chat/gemini', aiChatController.handleGemini);

router.post('/api/chat/openai', aiChatController.handleOpenAI);

export default router;

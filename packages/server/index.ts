import express from 'express';
import * as process from 'node:process';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import z from 'zod';
dotenv.config();

// Initialize AI Clients
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
const genAIClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAIClient.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
});

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
});

// health check api
app.get('/api/health', (req: express.Request, res: express.Response) => {
    res.send({
        message: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        port: port,
        hostname: req.hostname,
        protocol: req.protocol,
    });
});

// --- AI Endpoints ---

// conversationId -> lastResponseId
const conversations = new Map<string, Content[]>();

const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required!')
        .max(500, 'Prompt must be at most 500 characters long'),
    temperature: z
        .number()
        .min(0, 'Temperature must be at least 0')
        .max(1, 'Temperature must be at most 1')
        .optional(),
    maxTokens: z.number().min(1, 'Max tokens must be at least 1').optional(),
    conversationId: z.uuid(),
});
// Gemini Endpoint
app.post(
    '/api/chat/gemini',
    async (req: express.Request, res: express.Response) => {
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
            const chatSession = geminiModel.startChat({
                history: conversations.get(conversationId) || [],
                generationConfig: {
                    temperature: temperature ?? 0.2,
                    maxOutputTokens: maxTokens ?? 100,
                },
            });

            const result = await chatSession.sendMessage(prompt);
            const text = result.response.text();

            // Set conversation state
            if (conversationId) {
                conversations.set(conversationId, [
                    ...(conversations.get(conversationId) || []),
                    { role: 'user', parts: [{ text: prompt }] },
                    { role: 'model', parts: [{ text }] },
                ]);
            }

            res.json({
                source: 'gemini',
                message: text,
            });
        } catch (error) {
            console.error('Gemini Error:', error);
            res.status(500).json({
                error: 'Gemini failed to generate response',
            });
        }
    }
);

// OpenAI Endpoint
app.post(
    '/api/chat/openai',
    async (req: express.Request, res: express.Response) => {
        const { prompt } = req.body;

        try {
            const response = await openaiClient.responses.create({
                model: 'gpt-4o-mini',
                input: prompt,
            });

            res.json({
                source: 'openai',
                message: response.output_text,
            });
        } catch (error: any) {
            console.error('OpenAI Error:', error);
            res.status(error.status || 500).json({
                error: error.message || 'OpenAI failed to generate response',
            });
        }
    }
);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

import express from 'express';
import * as process from 'node:process';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenerativeAI, type Content } from '@google/generative-ai';

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

//health check api
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
const conversation = new Map<string, Content[]>();

// Gemini Endpoint (Free Tier)
app.post(
    '/api/chat/gemini',
    async (req: express.Request, res: express.Response) => {
        const { prompt, temperature, maxTokens, conversationId } = req.body;

        try {
            const chatSession = geminiModel.startChat({
                history: conversation.get(conversationId) || [],
                generationConfig: {
                    temperature: temperature ?? 0.2,
                    maxOutputTokens: maxTokens ?? 100,
                },
            });

            const result = await chatSession.sendMessage(prompt);
            const text = result.response.text();

            // Set conversation state
            if (conversationId) {
                conversation.set(conversationId, [
                    ...(conversation.get(conversationId) || []),
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

// OpenAI Endpoint (Paid Tier)
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

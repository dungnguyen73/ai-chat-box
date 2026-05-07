import express from 'express';
import { aiController } from './controllers/ai.controller';
import * as process from 'node:process';

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('AI API Server is running'));

app.get('/api/health', (req, res) => {
    res.send({
        message: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.post('/api/chat/gemini', aiController.handleGemini);
app.post('/api/chat/openai', aiController.handleOpenAI);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

export const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const genAIClient = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || ''
);

export const geminiModel = genAIClient.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
});

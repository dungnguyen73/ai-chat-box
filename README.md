# AI-Powered Applications Course 🤖

A modern, full-stack AI chat application built with a scalable **Monorepo** architecture. This project demonstrates how to integrate multiple AI providers (Google Gemini & OpenAI) using clean software engineering patterns.

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (Fast all-in-one JavaScript runtime)
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js/Bun, Express (v5), TypeScript
- **Validation**: Zod (Schema-based validation)
- **AI SDKs**:
    - `@google/generative-ai`
    - `openai`

## 📁 Project Structure

```text
├── packages/
│   ├── client/          # Vite + React Frontend
│   └── server/          # Express API Backend
│       ├── src/
│       │   ├── config/       # AI Client initializations
│       │   ├── controllers/  # Request/Response handling
│       │   ├── services/     # AI Business logic & Translation
│       │   ├── repositories/ # History & Data persistence
│       │   └── types/        # Unified Chat interfaces
```

## ⚙️ Setup Instructions

### 1. Prerequisites

Ensure you have [Bun](https://bun.sh/) installed.

### 2. Installation

```bash
bun install
```

### 3. Environment Variables

Create a `.env` file in `packages/server/`:

```env
PORT=3000
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

### 4. Running the Project

From the root directory, you can start both the client and server concurrently:

```bash
# Start both in development mode
bun run dev
```

Or run them individually:

```bash
# Backend only
cd packages/server && bun run dev

# Frontend only
cd packages/client && bun run dev
```

# Writing Assistant

AI-powered writing assistant that helps you correct grammar, spelling, and punctuation mistakes instantly.

🔗 **Live Demo**: [code-explannar-9baj.vercel.app](https://code-explannar-9baj.vercel.app)

## Features

- ✍️ Grammar and spelling correction
- 📝 Sentence structure improvement
- 🤖 AI-powered detailed explanations of corrections
- 🌓 Dark/Light mode
- 📋 Copy corrected text to clipboard
- ⚡ Fast and responsive
- 🎯 Professional writing suggestions

## Tech Stack

**Frontend**: React, Vite, Tailwind CSS  
**Backend**: Node.js, Express, OpenAI SDK (Nebius AI)

## Setup

### Backend (Server folder)

```bash
cd Server
npm init -y
npm install express cors dotenv helmet express-rate-limit
npm install openai
```

Create `.env` file:
```env
NEBIUS_API_KEY=your_api_key
FRONTEND_URL=http://localhost:5173
PORT=5001
```

Start server:
```bash
npm run dev
```

### Frontend (client folder)

```bash
cd client
npm install
npm run dev
```

## Deployment (Vercel)

1. **Backend**: Deploy `Server` folder, add `NEBIUS_API_KEY` and `FRONTEND_URL` env vars
2. **Frontend**: Deploy `client` folder, add `VITE_API_URL` env var

# Code Explanar

AI-powered code explanation tool that helps you understand any code snippet in seconds.

🔗 **Live Demo**: [code-explannar-9baj.vercel.app](https://code-explannar-9baj.vercel.app)

## Features

- 🎯 Supports 16+ programming languages
- 🤖 AI-powered detailed explanations
- 🌓 Dark/Light mode
- 📋 Copy to clipboard
- ⚡ Fast and responsive

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

## Author

Tashdiqur Rahman Shifat - [@TashdiqurRahmanShifat](https://github.com/TashdiqurRahmanShifat)
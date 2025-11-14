import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express(); // Initialize Express App

// Security Middlewares
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow only this origin.Rest can't access
        credentials: true,
    })
)

// Each IP address can make a maximum of 100 requests per 15-minute period
// After 15 minutes, the counter resets for that IP
const limiter=rateLimit({
    windowMs:15*60*1000, // 15 minutes
    max:100, // limit each IP to 100 requests per windowMs
    standardHeaders:true,
    legacyHeaders:false,
    message:"Too many requests"
})

app.use(limiter);
app.use(express.json({limit:"10mb"})); // Allow express to parse json data with limit of 10mb

const client = new OpenAI({
    baseURL: "https://api.tokenfactory.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY
})

app.post("/api/explain-code", async (req,res) => {
    try{
        const {code,language}=req.body; // Destructure code and language from request body
        if(!code || !language){
            return res.status(400).json({ error:"Code and Language are required fields." });
        }

        const messages=[
            {
                role:"system",
                content:"You are a code explanation assistant. Provide clear, concise explanations that fit within 2000 tokens. Focus on the most important aspects and be direct."
            },
            {
                role:"user",
                content:`Explain the following ${language || "" } code in detail:\n\n\`\`\`${language || ""}\n${code}\n\`\`\``
            }
        ];

        const response = await client.chat.completions.create({
            model:"openai/gpt-oss-120b",
            messages:messages,
            max_tokens:2000, // Limit response to 2000 tokens to control response length
            temperature:0.3, // Lower temperature for more focused responses
        });

        const explanation=response.choices[0].message.content;
        if(!explanation){
            return res.status(500).json({ error:"Failed to generate explanation." });
        }
        
        res.json({explanation,language:language || "unknown"}); // Send back the explanation and language
    } catch(error){
        console.error("Error in /api/explain-code:",error);
        res.status(500).json({ error:"Internal Server Error", details:error.message });
    }
})

// Port Configuration for Backend Server
const PORT=process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
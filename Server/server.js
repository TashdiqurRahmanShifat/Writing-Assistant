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

app.post("/api/correct-text", async (req,res) => {
    try{
        const {text}=req.body; // Destructure text from request body
        if(!text){
            return res.status(400).json({ error:"Text is required." });
        }

        const messages=[
            {
                role:"system",
                content:"You are a professional writing assistant. Correct grammar, spelling, punctuation, and improve sentence structure. Provide the corrected version followed by a brief explanation of the changes made. Format your response as:\n\nCorrected Text:\n[corrected version]\n\nChanges Made:\n- [list of corrections and improvements]"
            },
            {
                role:"user",
                content:`Please correct the following text:\n\n${text}`
            }
        ];

        const response = await client.chat.completions.create({
            model:"openai/gpt-oss-120b",
            messages:messages,
            max_tokens:2000, // Limit response to 2000 tokens to control response length
            temperature:0.3, // Lower temperature for more focused responses
        });

        const correction=response.choices[0].message.content;
        if(!correction){
            return res.status(500).json({ error:"Failed to generate correction." });
        }
        
        res.json({correction}); // Send back the correction
    } catch(error){
        console.error("Error in /api/correct-text:",error);
        res.status(500).json({ error:"Internal Server Error", details:error.message });
    }
})

// Port Configuration for Backend Server
const PORT=process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
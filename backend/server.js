require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        message: "AI Interview Coach Backend is running!"
    });
});

app.post("/evaluate", async (req, res) => {

    const { question, answer } = req.body;

    console.log("Question:", question);
    console.log("Answer:", answer);

    if (!question || !answer) {
        return res.status(400).json({
            message: "Question and answer are required."
        });
    }

    try {

        const prompt = `
You are an AI interview evaluator.

Evaluate the candidate's answer to the interview question.

Interview Question:
${question}

Candidate's Answer:
${answer}

Evaluate the answer based on:
1. Technical accuracy
2. Relevance
3. Clarity
4. Communication

Return ONLY valid JSON in this exact format:

{
  "score": 8,
  "feedback": "Short feedback about the answer.",
  "improvement": "One specific improvement suggestion."
}

The score must be between 1 and 10.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        console.log("GEMINI CALLED");

        const result = JSON.parse(response.text);

        res.json(result);

    } catch (error) {

        console.error("Gemini Error:", error);

        res.status(500).json({
            message: "Failed to evaluate answer."
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;
if (apiKey && apiKey !== "YOUR_API_KEY" && apiKey.trim() !== "") {
    genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Helper to get the Gemini model instance.
 * Throws a clean error if the API key is not configured.
 */
function getModel() {
    if (!genAI) {
        throw new Error("Gemini API key is not configured. Please define GEMINI_API_KEY in your backend/.env file.");
    }
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

/**
 * Generates an engaging property description using Gemini.
 * @param {string} title 
 * @param {string} location 
 * @param {string} keywords 
 * @returns {Promise<string>}
 */
export async function generateDescriptionText(title, location, keywords) {
    try {
        const model = getModel();
        const prompt = `You are an expert copywriter for premium vacation rentals and luxury hotels. 
Generate an engaging, high-converting, and beautiful property description (around 100-150 words) for a hotel stay named '${title}' located in '${location}'. 
Incorporate these highlights/keywords: ${keywords}. 
Keep the tone welcoming, sophisticated, and descriptive. Do not include pricing, booking instructions, or fake policies. 
Return ONLY the description paragraph without any greeting, title, or extra meta-text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini description generation error:", error.message);
        throw new Error(`AI Description Generator failed: ${error.message}`);
    }
}

/**
 * Summarizes hotel guest reviews using Gemini.
 * @param {Array<{rating: number, comment: string}>} reviewsList 
 * @returns {Promise<string>}
 */
export async function summarizeReviewsText(reviewsList) {
    try {
        if (!reviewsList || reviewsList.length === 0) {
            return "No guest reviews available to summarize yet.";
        }

        const model = getModel();
        const reviewsText = reviewsList
            .map((r, i) => `- [Review ${i + 1} - ${r.rating || 5}/5 Stars]: "${r.comment}"`)
            .join("\n");

        const prompt = `You are an AI assistant for a premium hotel booking platform. 
Analyze the following list of guest reviews for a hotel property. 
Generate a concise summary (maximum 100-120 words) highlighting:
1. The main positive aspects (what guests loved most).
2. Any negative points, concerns, or areas of improvement mentioned by guests.
Write in a clear, objective, and helpful tone using bullet points. Do not mention individual reviewer names. 
Here are the reviews:
${reviewsText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini reviews summarization error:", error.message);
        throw new Error(`AI Review Summarizer failed: ${error.message}`);
    }
}

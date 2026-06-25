import { generateDescriptionText, summarizeReviewsText } from "../utils/gemini.js";

/**
 * Handles generating a listing description from keywords.
 * POST /ai/generate-description
 */
export const generateDescription = async (req, res) => {
    try {
        const { title, location, keywords } = req.body;

        if (!title || !location || !keywords) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters: title, location, and keywords are required."
            });
        }

        console.log(`Generating AI description for: "${title}" in "${location}" with keywords: "${keywords}"`);
        const text = await generateDescriptionText(title, location, keywords);

        return res.status(200).json({
            success: true,
            text
        });
    } catch (error) {
        console.error("AI Description generation error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate AI description."
        });
    }
};

/**
 * Handles generating a review summary from guest comments.
 * POST /ai/summarize-reviews
 */
export const summarizeReviews = async (req, res) => {
    try {
        const { reviews } = req.body;

        if (!reviews || !Array.isArray(reviews)) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters: reviews must be an array."
            });
        }

        console.log(`Generating AI summary for ${reviews.length} reviews...`);
        const summary = await summarizeReviewsText(reviews);

        return res.status(200).json({
            success: true,
            summary
        });
    } catch (error) {
        console.error("AI Reviews summary error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to summarize reviews."
        });
    }
};

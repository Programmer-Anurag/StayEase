import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middleware.js";
import { generateDescription, summarizeReviews } from "../controllers/ai.js";

// Generate Property Description (requires authentication since only hosts can create/edit listings)
router.post("/generate-description", isLoggedIn, wrapAsync(generateDescription));

// Summarize Reviews (publicly accessible for anyone reading listing details)
router.post("/summarize-reviews", wrapAsync(summarizeReviews));

export const aiRoute = router;

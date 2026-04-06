import express from "express"
const router=express.Router({ mergeParams: true });

import { wrapAsync } from "../utils/wrapAsync.js";
import { expressError } from "../utils/expressError.js";
import { listingSchema,reviewschema } from "../schema.js";
import { Review } from "../models/review.js";
import { Listing } from "../models/listing.js";
import { isLoggedIn } from "../middleware.js";
import { isAuthor } from "../middleware.js";
import { createReview, destroyReview } from "../controllers/reviews.js";



const validateReview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg )
    }
    else{
        next();
    }
}


//reviews route
//post 
router.post("/",isLoggedIn,validateReview,wrapAsync(createReview))


//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(destroyReview))

export const reviewRoute=router;
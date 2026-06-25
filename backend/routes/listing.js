import express from "express"
const router=express.Router();
import { wrapAsync } from "../utils/wrapAsync.js";
import { listingSchema,reviewschema } from "../schema.js";
import { expressError } from "../utils/expressError.js";
import { isLoggedIn } from "../middleware.js";
import {deleteListing, index, postListing, showListing, updateListing, seedRealHotels} from "../controllers/listings.js"



const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg )
    }
    else{
        next();
    }
}


//seed route
router.post("/seed", wrapAsync(seedRealHotels));

//index route
router.route("/")
.get(wrapAsync(index))
// .post(
//     isLoggedIn,
//     validatelisting,
//     upload.single('listing[image]'),
//     wrapAsync(postListing)
//    );



//new listing
router.post("/new",isLoggedIn,postListing);


//show route
router.get("/:id",wrapAsync(showListing))




//update route
router.put("/:id",isLoggedIn,validatelisting,wrapAsync(updateListing))


//delete route
router.delete("/:id",isLoggedIn,wrapAsync(deleteListing))


export const listingRoute=router;


import { Review } from "./models/review.js";
import jwt from "jsonwebtoken"

export const isLoggedIn = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    
 

    try {


        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        
        
        
        console.log(decoded);
        
        
        req.user = decoded;
         
        next();
    } catch (err) {
        console.log(err.message);
       
        if(err.message=="jwt expired"){
            return res.status(200).send({error:"token expired"});
        }

        return res.status(200).send({error:err.message});
    }

   
}

export const isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you did not  create  this review");
        return res.redirect(`/listings/${id}`)
    }
    next();

}



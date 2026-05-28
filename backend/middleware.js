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
    if (!review) {
        return res.status(404).json({ error: "Review not found" });
    }
    if (!req.user || !review.author.equals(req.user.id)) {
        return res.status(403).json({ error: "You did not create this review" });
    }
    next();
}



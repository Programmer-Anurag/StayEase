import { Listing } from "../models/listing.js";
import { Review } from "../models/review.js";

export const createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  const newReview = new Review(req.body.review);
  
  

  newReview.author = req.user.id;
  console.log(newReview);
  

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  await newReview.populate("author");

return res.status(201).send({success:"review added successfully",newReview})
};



export const destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(id);
    
   let result=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   console.log(result);
   
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}
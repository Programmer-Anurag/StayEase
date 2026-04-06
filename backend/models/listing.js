import mongoose, { Schema } from "mongoose";
import { Review } from "./review.js";

const listingSchema=mongoose.Schema({
    title:{type:String,
        require:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,
    coordinates: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],        // [longitude, latitude]
            required: false
        }
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        } 
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {await Review.deleteMany({_id:{$in:listing.reviews}});}
})

export const Listing=mongoose.model("Listing",listingSchema);

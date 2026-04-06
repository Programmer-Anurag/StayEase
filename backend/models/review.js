import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

})

export const Review=mongoose.model("Review",reviewSchema);
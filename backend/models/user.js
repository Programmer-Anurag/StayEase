import mongoose, { SchemaTypes } from "mongoose";
import { Schema } from "mongoose";


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    hash:{
        type:String,
        required:true 
    },
    avtar:{
        type:String  
    }

})



export const User=mongoose.model("User",userSchema);


import express from "express";
const app=express();
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import { listingRoute } from "./routes/listing.js";
import { reviewRoute } from "./routes/review.js";
import { userRoute } from "./routes/user.js";
import session from "express-session";
import flash from "connect-flash"
import { User } from "./models/user.js";
import cors from "cors"
import cookieParser from "cookie-parser";



dotenv.config();

connectDB();
app.set("view engine","ejs");
app.set("views",path.join(import.meta.dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(cors());
app.use(express.json())
app.use(cookieParser());

app.use(express.static(path.join(import.meta.dirname,"/public")));

// app.use((req, res, next) => {
//   console.log("Received:", req.method, req.url);
//   next();
// });


const sessionOptions={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.get("/",(req,res)=>{
    res.send("this the homepage of StayEase")
})


app.use(session(sessionOptions))
app.use(flash());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    // console.log( res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})





app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);

// app.use((req, res, next) => {
//     next(new expressError(404, "page not found"));
// });

app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
})

app.listen(8080,"0.0.0.0",()=>{
    console.log("server is running on 8080");
})
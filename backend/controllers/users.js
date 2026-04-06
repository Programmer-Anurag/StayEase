
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"






export const createUser = async (req, res) => {
    try {
        // console.log(req.body);

        let { username, email, password,avtar } = req.body;




        const existingUser = await User.findOne(
            {
                $or: [{ email }, { username }]
            }
        );

        if(existingUser){
           return  res.status(400).send({
                error:"user already exist"
            })
        }
        if(!avtar){
            avtar="https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }



        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, function (err, hash) {
                // Store hash in your password DB
                const user = new User({ email, username, salt, hash,avtar });
                user.save();

            });
        });


        return res.status(400).send({
            success:"welcome to the stayEase",
        })
        


    } catch (e) {
       return res.status(500).send({error:"something went wrong"})

    }
}

export const loginForm = (req, res) => {
    res.render("users/login.ejs");
}



export const loginUser = async (req, res) => {
    

    let {email,password}=req.body;

      const user=await User.findOne({email});
      console.log(user);
      
      if(!user){
        return res.status(200).send({
            error:"user is not registered"
        })

      }

       bcrypt.compare(password,user.hash,(err,result)=>{
        if(result==false){
            // console.log(result);
            
            return res.status(200).send({
                error:"invalid login credential"
            })

        }
       });

       bcrypt.compare(password,user.hash,(err,result)=>{
        if(result==true){
            // console.log(result);
           const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn: "1h" })

        
            return res.status(200).send({
                success:"Welcome to the StayEase",
                "token":token
            })

        }
       });
    
    


 
}



export const logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
}
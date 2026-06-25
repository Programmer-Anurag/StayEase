
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"






export const createUser = async (req, res) => {
    try {
        let { username, email, password, avtar } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).send({
                error: "user already exist"
            });
        }
        
        if (!avtar) {
            avtar = "https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User({ email, username, salt, hash, avtar });
        await user.save();

        return res.status(201).send({
            success: "welcome to the stayEase",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ error: "something went wrong" });
    }
}

export const loginForm = (req, res) => {
    res.render("users/login.ejs");
}

export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: email }, { username: email }]
        });
        
        if (!user) {
            return res.status(200).send({
                error: "user is not registered"
            });
        }

        const isMatch = await bcrypt.compare(password, user.hash);
        if (!isMatch) {
            return res.status(200).send({
                error: "invalid login credential"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).send({
            success: "Welcome to the StayEase",
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Server error during login" });
    }
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
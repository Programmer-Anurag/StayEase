import express from "express"
const router=express.Router();
import { User } from "../models/user.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { expressError } from "../utils/expressError.js";

import { createUser, loginUser, logout } from "../controllers/users.js";

router.post("/signup",wrapAsync(createUser));

router.post("/login",loginUser);

router.get("/logout",logout)




export const userRoute=router;
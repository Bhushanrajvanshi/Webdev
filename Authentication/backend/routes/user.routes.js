import express from "express"
import { userRegister, userLogin, userLogout, getProfile, sendOtp } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

/**
 * -> Routes
 * -> api/register
 * -> api/login
 * -> api/profile
 * -> api/logout
 * */ 


router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/profile", authMiddleware, getProfile)
router.post("/logout", userLogout)
router.post("/otp", sendOtp);



export default router;
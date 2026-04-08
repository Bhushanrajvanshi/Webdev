import User from "../models/user.model.js"
import OTP from "../models/otp.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import { sendEmail } from "../utils/sendEmail.utils.js";



async function userRegister(req, res) {
    const {username, email, password} = req.body;

    if( !username || !email || !password ){
        return res.status(401).json({
            message: "Something is missing please fill all details."
        })
    }

    const existUser = await User.findOne({
        email: email
    })

    if( existUser ){
        return res.status(409).json({
            message: "User already exist please login"
        })
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    })
    
    const Token = jwt.sign( {id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

    res.cookie("Token", Token, { 
        httpOnly: true, 
        secure: false, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 100,
    })

    res.status(201).json({
        message: "User Register successfuly",
        Token,
        newUser
    })
}

async function userLogin(req, res) {
    const { email, password } = req.body;

    if( !email || !password ){
        return res.status(401).json({
            message: "Something is missing please fill all details."
        })
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(401).json({
            message: "Email or password is Invalid"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(409).json({
            message: "Something is wrong plaese check details."
        })
    }

    const Token = jwt.sign( {id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

    res.cookie("Token", Token, { 
        httpOnly: true, 
        secure: false, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 100,
    })

    res.status(201).json({
        message: "Login successfuly",
    })
}

async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");

        // validation
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            message: "Profile fetched successfully",
            user
        })  
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function userLogout(req, res) {
    res.clearCookie("generateToken",{
        httpOnly: true, 
        secure: false, 
        sameSite: "strict",
    })
    res.status(200).json({
        message: "Logout Successfully"
    })
}

async function sendOtp(req, res) {
    try {
        const { email } = req.body;
        if(!email){
            return res.status(409).json({
                message: "please provide email"
            })
        }

        // find user by email if exist then send otp 
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({
                message: "User already exist please login then request for otp"
            })
        }

        // make otp generator
        const otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false, 
            specialChars: false, 
            digits: true 
        });

        // send otp to user email
        try {
            await sendEmail(email, "Your OTP for Authentication System", `Your OTP is ${otp}. It will expire in 5 minutes.`);
        } catch (error) {
            console.error("Error sending OTP: ", error.message);
        }

        // save otp in database
        await OTP.create({ email, otp });
        res.status(200).json({
            message: "OTP sent successfully to your email"
        })

    } catch (error) {
        console.error("Error in sending otp: ", error.message);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export { userRegister, userLogin, userLogout, getProfile, sendOtp }
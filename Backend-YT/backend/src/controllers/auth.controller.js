const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailServices = require("../services/email.service");


/**
 * - @desc    Register a new user
 * - @route   POST /api/auth/register
 * - @access  Public
 */

async function userRegisterController(req, res) {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const isExistingUser = await userModel.findOne({
        email: email
    })

    if (isExistingUser) {
        return res.status(422).json({
            message: "User already exists with this email, please login instead",
            status: "fail"
        })
    }

    const newUser = await userModel.create({
        name,
        email,
        password
    })

    const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "3d"});

    res.cookie("token", token);

    res.status(201).json({
        user: {
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id
        }, 
        token
    })

    await emailServices.sendRegistrationEmail(newUser.email, newUser.name);
}


/**
 * - @desc    Login an existing user
 * - @route   POST /api/auth/login
 * - @access  Public
 */ 

async function userLoginController(req, res) {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "email or password is INVALID",
                status: "fail"
            })
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "email or password is INVALID",
                status: "fail"
            })
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "3d"});

        res.cookie("token", token);

        res.status(201).json({
        user: {
            name: user.name,
            email: user.email,
            _id: user._id
        }, 
        token
       })
    }


module.exports = { userRegisterController, userLoginController };
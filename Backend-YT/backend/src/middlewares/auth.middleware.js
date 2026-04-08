const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized, token not found",
            status: "fail"
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized, user not found",
                status: "fail"
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        console.log("jwt varify failed", error);
        return res.status(401).json({
            message: "Unauthorized - bad token",
            status: "fail"
        })
    }
}


async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing",
            status: "fail"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const user = await userModel.findById(decoded.userId).select("+systemUser");

        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, user does not have system user privileges",
                status: "fail"
            })
        }


        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized - bad token",
            status: "fail"
        })
    }

}


module.exports = { authMiddleware, authSystemUserMiddleware};
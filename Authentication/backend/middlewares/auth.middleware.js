import JWT from "jsonwebtoken";

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.Token;
        console.log("TOKEN : ",token);
        
        // validation
        if(!token){
            return res.status(401).json({
                message: "Unauthorized, please login to access this resource"
            })
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({
                message: "Unauthorized, invalid token"
            })
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export { authMiddleware }
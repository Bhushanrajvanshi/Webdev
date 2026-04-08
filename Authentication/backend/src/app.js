import  express  from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import registerRoutes from "../routes/user.routes.js"

const app = express();


// Middle-Ware
app.use(cors({
    origin: "http://localhost:5173", // React port
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


/**
 * authRoutes
 * */ 

app.use("/api", registerRoutes)

export default app;
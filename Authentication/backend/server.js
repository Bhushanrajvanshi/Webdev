import app from "./src/app.js"
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import dns from "dns"


dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config()

connectDB()

app.listen(5000, () => {
    console.log("Server is listening on port 500");
    
})
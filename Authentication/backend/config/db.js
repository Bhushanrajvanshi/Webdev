import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("server successfully connect to mongoDB");
    } catch (error) {
        console.log(`connection fail in mongoDB:  ${error.message}`);
    }
}

export default connectDB;
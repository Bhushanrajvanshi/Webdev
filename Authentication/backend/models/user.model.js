import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        requared: [true, "Email is must be required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password must be required"],
        unique: true,
        minlength: 6
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;
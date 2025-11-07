import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
     image: {
        type: String,
    },
    password: {
        type: String,
        required: true,

    },
    
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Enable', 'Disable'],
        default: 'Enable'
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});
export const User = mongoose.model("User", userSchema);

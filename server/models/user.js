import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    subscription: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        accessCount: { type: Number, default: 0 }
    }]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);


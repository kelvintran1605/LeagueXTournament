import mongoose from "mongoose";

// Create schema
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
    position: {
        type: String,
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Team"
    },
    isCaptain: {
        type: Boolean,
        required: false,
    },
    role: {
        type: String,
        required: true
    },
    profileImage: {
        publicId: String,
        url: String
    }
});

// Create model from schema
const User = mongoose.model("User", userSchema);

export default User;
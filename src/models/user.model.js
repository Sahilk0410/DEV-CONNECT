import mongoose , { Schema } from "mongoose"

const userSchema = new Schema({
    
    name: {
        type: String,
        required: true
    }, 

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }, 

    password: {
        type: String,
        required: true
    }, 

    avatar: {
        type: String, // cloudinary URL
        required: true
    },

    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    followings: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]

}, {timestamps: true}) 

export const User = mongoose.model("User", userSchema)
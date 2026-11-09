
import mongoose, { Schema } from "mongoose"

const postSchema = new Schema({

    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema)

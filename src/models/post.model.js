import mongoose, {Schema, trusted} from "mongoose"
import { User } from "./user.model"

const postSchema = new Schema({

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
     
    content: {
        type: string, 
        required: true
    }, 

    image: {
        type: string, // cloudinary URL
        required: true
    }, 

    likes: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }


}, {timestamps: true})

export const Post = mongoose.model("Post", postSchema)
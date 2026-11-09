
import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Post } from "../models/post.model.js"


// LIKE POST
const likePost = asyncHandler(async (req, res) => {

    const { postId } = req.params
    const userId = req.user._id

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $addToSet: {
                likes: userId
            }
        },
        {
            new: true
        }
    )

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    return res.status(200).json(
        new ApiResponse(200, post, "Post liked successfully")
    )
})


// UNLIKE POST
const unlikePost = asyncHandler(async (req, res) => {

    const { postId } = req.params
    const userId = req.user._id

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $pull: {
                likes: userId
            }
        },
        {
            new: true
        }
    )

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    return res.status(200).json(
        new ApiResponse(200, post, "Post unliked successfully")
    )
})


export {
    likePost,
    unlikePost
}

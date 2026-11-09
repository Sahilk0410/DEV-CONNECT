import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"
import { Post } from "../models/post.model.js"


// CREATE COMMENT
const createComment = asyncHandler(async (req, res) => {

    const { postId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Comment content is required")
    }

    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    const comment = await Comment.create({
        post: postId,
        author: req.user._id,
        content
    })

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    )
})


// GET COMMENTS OF A POST
const getPostComments = asyncHandler(async (req, res) => {

    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    const comments = await Comment.find({ post: postId })
        .populate("author", "username name avatar")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})


// UPDATE COMMENT
const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Comment content is required")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot update this comment")
    }

    comment.content = content

    await comment.save()

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    )
})


// DELETE COMMENT
const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot delete this comment")
    }

    await comment.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    )
})


export {
    createComment,
    getPostComments,
    updateComment,
    deleteComment
}

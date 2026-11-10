import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Post } from "../models/post.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


// CREATE POST
const createPost = asyncHandler(async (req, res) => {

    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const imageLocalPath = req.file?.path

    if (!imageLocalPath) {
        throw new ApiError(400, "Post image is required")
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    if (!image) {
        throw new ApiError(500, "Image upload failed")
    }

    const post = await Post.create({
        author: req.user._id,
        content,
        image: image.url
    })

    return res.status(201).json(
        new ApiResponse(201, post, "Post created successfully")
    )
})


// GET ALL POSTS
const getAllPosts = asyncHandler(async (req, res) => {

    const posts = await Post.find()
        .populate("author", "username name avatar")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, posts, "Posts fetched successfully")
    )
})


// GET SINGLE POST
const getPostById = asyncHandler(async (req, res) => {

    const { postId } = req.params

    const post = await Post.findById(postId)
        .populate("author", "username name avatar")
        .populate("likes", "username name avatar")

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    return res.status(200).json(
        new ApiResponse(200, post, "Post fetched successfully")
    )
})


// UPDATE POST
const updatePost = asyncHandler(async (req, res) => {

    const { postId } = req.params
    const { content } = req.body

    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot update this post")
    }

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    post.content = content

    await post.save()

    return res.status(200).json(
        new ApiResponse(200, post, "Post updated successfully")
    )
})


// DELETE POST
const deletePost = asyncHandler(async (req, res) => {

    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot delete this post")
    }

    await post.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, {}, "Post deleted successfully")
    )
})


export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
}

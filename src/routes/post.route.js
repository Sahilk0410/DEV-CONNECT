import { Router } from "express"

import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from "../controllers/post.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/")
    .get(getAllPosts)
    .post(verifyJWT, upload.single("image"), createPost)

router.route("/:postId")
    .get(getPostById)
    .patch(verifyJWT, updatePost)
    .delete(verifyJWT, deletePost)

export default router

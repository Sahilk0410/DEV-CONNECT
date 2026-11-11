import { Router } from "express"

import {
    likePost,
    unlikePost
} from "../controllers/like.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/:postId/like")
    .post(verifyJWT, likePost)
    .delete(verifyJWT, unlikePost)

export default router

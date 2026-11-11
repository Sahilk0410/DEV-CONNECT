import { Router } from "express"

import {
    createComment,
    getPostComments,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/:postId")
    .get(getPostComments)
    .post(verifyJWT, createComment)

router.route("/:postId/:commentId")
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment)

export default router

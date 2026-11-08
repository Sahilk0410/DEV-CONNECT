import { Router } from "express"

import {
    registerUser,
    loginUser,
    logoutUser
} from "../controllers/auth.controller.js"

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()


// REGISTER USER
router.route("/register").post(
    upload.single("avatar"),
    registerUser
)


// LOGIN USER
router.route("/login").post(
    loginUser
)


// LOGOUT USER
router.route("/logout").post(
    verifyJWT,
    logoutUser
)


export default router

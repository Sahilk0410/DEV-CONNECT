import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend 
    const {name, username, email, password} = req.body
    

    // validation - not empty 
    if (!fullName || !email || !username || !password) {
    throw new ApiError(400, "All fields are required");
}

    // check if user already exist 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")

    }
    

    // check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")

    }

    // create User object - create entry in Database
    const user = await User.create({
        name,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

export default registerUser         
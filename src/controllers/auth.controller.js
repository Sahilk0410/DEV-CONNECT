import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler( async (req, res) => {
    
    // info about request
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // get user details from frontend 
    const {name, username, email, password} = req.body
    

    // validation - not empty 
    if (!username || !email || !username || !password) {
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
    const avatarLocalPath = req.file?.path;
    
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required!!!")

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


const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    const {email, username, password} = req.body
    
    // check for username and email
    if(!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // find the user 

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    // check password

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // access and refresh token

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    

    //send cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User loggen in Successfully"
        )
    )


})


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})






export  {
    registerUser,
    loginUser,
    logoutUser
}         
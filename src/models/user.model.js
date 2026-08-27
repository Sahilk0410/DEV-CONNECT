import mongoose , { Schema } from "mongoose"

const userSchema = new Schema({
    
    name: {
        type: String,
        required: true
    }, 

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }, 

    password: {
        type: String,
        required: true
    }, 

    avatar: {
        type: String, // cloudinary URL
        required: true
    },

    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    followings: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]

}, {timestamps: true}) 


// this method will encypts the password before saving into the database
userSchema.pre("Save", async function (next) {

    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// comparing sended password and saved password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// generates access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}


// generates refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
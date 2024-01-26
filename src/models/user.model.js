import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true // searching filled is enabled and true optimize

        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,


        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true

        },
        avatar: {
            type: String,
            required: true

        },
        coverImage: {
            type: String,


        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "video"
            }
        ],
        password:
        {
            type: String,
            required: [true, 'password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { // check that password is modified or not 
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    await bcrypt.compare(password, this.password);
}
// jitne chahiye utane methods aap apne schema me add kar sakate ho 
userSchema.methods.generateAccessToken = function () {
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
            // this method is access your main data
        },
        // this is payload 
         process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    ) // .sign method is used for generate token
}

userSchema.methods.generateRefreshToken = function () {
    jwt.sign(
        {
            _id: this._id,
          
            
        },
        // this is payload 
         process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const user = mongoose.model("user", userSchema)
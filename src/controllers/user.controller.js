import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apierror.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const registeruser = asyncHandler(async (req , res   ) => {
        // data comes from url => forms, json ->data get from body 
    //get user details from frontend
    //validation - not empty
    // chek if user already exists  : username , email
    //check for images , check for avatar
    // upload them to cloudnary , avatar //multer , cloundary
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    // return resopnse 
    const {fullName , email , username , password } = req.body 
    console.log("email : " , email )

    // if (fullname === "" ){
    //     throw new apiError(400 , "fullname is required")
    // }

    if(
        [fullName , email , username , password].some((field)=>field?.trim() === "")
    ){
        throw new apiError(400 , "All fields are required")
    }

   const existsUser = await user.findOne({
        $or : [{ username },{ email }]
    })
    if(existsUser){
        throw new apiError(409 , "User with email or username already exists")
    }
   const avatarLocalPath =  req.files?.avatar[0]?.path
  const coverImageLocalPath =req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new apiError(400  ,"avatar file is required")
    }
   
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const cover = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new apiError(400  ,"avatar file is required")
   }

  const User = await user.create({
    fullName,
    avatar : avatar.url,
    coverImage : cover?.url || "",
    email,
    password,
    username : username.toLowerCase()

   })
  const createduser = await user.findById(User._id).select(
    "-password -refreshToken"
  )
  if(!createduser){
    throw new apiError(500 , "something went wrong while creating user")
  }
   
  return res.status(201).json(
    new ApiResponse(200, createduser , "User registered Successfully")
  )
})


export {registeruser}
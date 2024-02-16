import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apierror.js"
import { user } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import { JsonWebTokenError } from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const User = await user.findById(userid)
    console.log(User);
    const accessToken = User.generateAccessToken()
    const refreshToken = User.generateRefreshToken()

    User.refreshToken = refreshToken
    await User.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  }
  catch (error) {
    throw new apiError(500, "Something went wrong while generating access and refersh token")
  }
}


const registeruser = asyncHandler(async (req, res) => {
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
  const { fullName, email, username, password } = req.body
  console.log("email : ", email)

  // if (fullname === "" ){
  //     throw new apiError(400 , "fullname is required")
  // }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required")
  }

  const existsUser = await user.findOne({
    $or: [{ username }, { email }]
  })
  if (existsUser) {
    throw new apiError(409, "User with email or username already exists")
  }
  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath =req.files?.coverImage[0]?.path

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
    console.log(req.files.coverImage)
  }
  if (!avatarLocalPath) {
    throw new apiError(400, "avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const cover = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new apiError(400, "avatar file is required")
  }

  const User = await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: cover?.url || "",
    email,
    password,
    username: username.toLowerCase()

  })
  const createduser = await user.findById(User._id).select(
    "-password -refreshToken"
  )
  if (!createduser) {
    throw new apiError(500, "something went wrong while creating user")
  }

  return res.status(201).json(
    new ApiResponse(200, createduser, "User registered Successfully")
  )


})


const loginUser = asyncHandler(async (req, res) => {
  // req body-> data
  //username aur email
  //find the user
  //password check
  //access and referesh token 
  //send cookie 

  const { username, email, password } = req.body
  if (!(username || email)) {
    throw new apiError(400, "username or email is required",)
  }
  const User = await user.findOne({
    $or: [{ username }, { email }]
  })
  if (!User) {
    throw new apiError(404, "user does not exist");

  }
  // user mongoose ka object he 
  // mongoose ke dwara avalable he vo he findone , updateone 
  //jo hamane khudake method banaye in mongoose is avalable in our user 
  //database se instance lia he hamane apane user ka aur jo bhi method banaye he hamane us
  const isPasswordValid = await User.isPasswordCorrect(password)

  if (!isPasswordValid) {
    console.log(password)

    throw new apiError(401, "invalid user credentials")
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(User._id);

  const loggedinUser = await user.findById(User._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200,
      {
        user: loggedinUser, accessToken, refreshToken

      },
      "User logged in successfully"
    ))

})

const logoutUser = asyncHandler(async (req, res) => {
  const User = await user.findById(
    req.user._id
  )
  User.refreshToken = undefined
  await User.save({ validateBeforeSave: false })

  const logoutu = await user.findById(User._id)

  console.log(logoutu)
  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "user logged out"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new apiError(401, "unauthrorize request")
  }
  try {
    const decodedtoken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const User = await user.findById(decodedtoken?._id)
  
    if (!User) {
      throw new apiError(401, "Invalid refresh token")
    }
    if(incomingRefreshToken !== User?.refreshToken){
      throw new apiError(401, "Refresh token is expired")
    }
  
    const options = {
      httpOnly : true,
      secure : true
  
    }
    const {accessToken, newrefreshToken} = await  generateAccessAndRefreshToken(User._id)
  
   return res
   .status(200)
   .cookie("accessToken" , accessToken , options)
   .cookie("refreshToken" , newrefreshToken , options)
   .json(
    new ApiResponse(200, {
      accessToken, newrefreshToken
    } , "Access token refreshed")
   )
  } catch (error) {
    throw new apiError(401 , error?.message , "Invalid refresh token")
  }
})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
  const {oldpassword , newpassword} = req.body

  const User = user.findById(req.user?._id) // check this line of code
 const ispasswordcorrect = await User.isPasswordCorrect(oldpassword)
 if(!ispasswordcorrect)
 {
  throw new apiError(401 , "Invalid old password")

 }

 User.password = newpassword
 await User.save({validateBeforeSave : false})

 return res
 .status(200)
 .json( new ApiResponse(200 , {} , "password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res)=>{
  return res
  .status(200)
  .json(200 , req.user , "current user export successfully")

})

const updateAccoutDetails = asyncHandler((req, res)=>{
  const {fullName , email , username} = req.body;
  if(!(fullName || email)){
    throw new apiError(400 , "All fields are required")

  }

  const User = user.findByIdAndUpdate(
    req.user?._id , 
    {
// learn aggrigation and reduce
      $set : {
        fullName,
       email: email
      }
    },
    {new : true}).select("-password")

    res
    .status(200)
    .json(new ApiResponse(200, User , "account details updated successfully"))

})

const updateUserAvatar = asyncHandler(async(req, res)=>{
  const avatarLocalPath = req.file?.path
  if(!avatarLocalPath){
    throw new apiError(400 , "avatar file is required")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if(!avatar.url){
    throw new apiError(400 , "Error while uploading avatar")
  }

  const User = await  user.findByIdAndUpdate(
    req.user?._id , 
    {
      $set : {
        avatar : avatar.url
      }
    },
    {new : true}).select("-password")

    res
    .status(200)
    .json(new ApiResponse(200, User , "avatar updated successfully"))

})

const updateUserCoverImage = asyncHandler(async(req, res)=>{
  const coverImageLocalPath = req.file?.path
  if(!coverImageLocalPath){
    throw new apiError(400 , "cover image file is required")
  }
  const cover = await uploadOnCloudinary(coverImageLocalPath)
  if(!cover.url){
    throw new apiError(400 , "Error while uploading cover image")
  }

  const User = await  user.findByIdAndUpdate(
    req.user?._id , 
    {
      $set : {
        coverImage : cover.url
      }
    },
    {new : true}).select("-password")

    res
    .status(200)
    .json(new ApiResponse(200, User , "cover image updated successfully"))

});

export { 
  registeruser, 
  loginUser, 
  logoutUser , 
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccoutDetails,
  updateUserAvatar,
  updateUserCoverImage
 }
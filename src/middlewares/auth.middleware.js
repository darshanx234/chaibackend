import { user } from "../models/user.model.js";
import { apiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const varifyJWT = asyncHandler(async (req, _ , next)=>{
  try {
    const token=  req.cookies?.accessToken || req.header("Authorizaton"?.replace("Bearer ",""))
      if(!token){
          throw new apiError(401, "Unauthorize request")
      }
  
     const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const User= await user.findById(decodedToken?._id).select("-password, -refreshToken")
    if(!User){
      //discuss about frontend
      throw new apiError(401, "invalid Access Token")
    }
  
    req.user = user;
    next()
  } catch (error) {
    throw new apiError(401, error?.message || "invalid excess token")
    
  }
})
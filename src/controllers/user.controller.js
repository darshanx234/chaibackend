import { asyncHandler } from "../utils/asyncHandler";

const registeruser = asyncHandler(async (req , res ) => {
    res.status(200).json({
        message : "ok"
    })
})

export {registeruser}
import { asyncHandler } from "../utils/asyncHandler.js";

const registeruser = asyncHandler(async (req , res   ) => {
    res.status(200)
    res.json({
        status : "ok"
    })
})

export {registeruser}
import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registeruser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { varifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/r").get((req, res) => {
    res.status(200).json({
        status: "ok"
    })
})

router.route("/register").post(
    upload.fields([{
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }]
    ), registeruser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(varifyJWT ,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router
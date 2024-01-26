import { Router } from "express";
import { registeruser } from "../controllers/user.controller.js";

const router = Router()

router.route("/r").get((req ,res)=>{
    res.status(200).json({
        status : "ok"
    })
})

router.route("/register").post(registeruser)

export default router
import express from "express"
const router = express.Router()

import { registerStudent, LoginStudent } from "../controller/userController"




router.route("/register").post(registerStudent)



router.route("/login").post(LoginStudent)

export default router;
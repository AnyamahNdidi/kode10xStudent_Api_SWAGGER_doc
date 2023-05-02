import express from "express"
const router = express.Router()

import { registerStudent, LoginStudent, getAllStudent, getSingleStudent } from "../controller/userController"




router.route("/register").post(registerStudent)
router.route("/login").post(LoginStudent)


router.route("/allstudent").get(getAllStudent)
router.route("/onestudent/:id").get(getSingleStudent)

export default router;
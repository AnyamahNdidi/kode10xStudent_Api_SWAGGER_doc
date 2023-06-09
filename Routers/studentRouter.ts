import express from "express"
const router = express.Router()

import { registerStudent, LoginStudent, getAllStudent, getSingleStudent, resetUserPassword,changePassword} from "../controller/userController"




router.route("/register").post(registerStudent)
router.route("/login").post(LoginStudent)
router.route("/reset/password").post(resetUserPassword)


router.route("/allstudent").get(getAllStudent)
router.route("/onestudent/:id").get(getSingleStudent)

router.route("/user/:id/password-change").patch(changePassword)


export default router;
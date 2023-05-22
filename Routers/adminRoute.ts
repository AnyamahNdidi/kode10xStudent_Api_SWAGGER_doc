import express from "express"
const router = express.Router()

import { registerAdmin, loginAdmin} from "../controller/adminController"


router.route("/register/admin").post(registerAdmin)
router.route("/login/admin").post(loginAdmin)




export default router;
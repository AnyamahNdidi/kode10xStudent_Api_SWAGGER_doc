import express from "express"
const router = express.Router()

import { registerAdmin} from "../controller/adminController"


router.route("/register/admin").post(registerAdmin)


export default router;
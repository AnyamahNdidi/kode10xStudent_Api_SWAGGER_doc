import express from "express"
const router = express.Router()

import { editProfile, editPic } from "../controller/studentProfileController"
import upload from "../utils/multer"


router.route("/edit/profile/:id").patch(editProfile)
router.route("/editprofile/:id").patch(upload, editPic)

export default router;


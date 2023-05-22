import express from "express"
const router = express.Router()
import {verify} from "../middlewares/verifyToken"
import { postImage, getAllImage} from "../controller/galleryController"
import upload from "../utils/multer"

router.route("/post/image").post(verify, upload, postImage)

router.route("/getall/image").get(getAllImage)


export default router;
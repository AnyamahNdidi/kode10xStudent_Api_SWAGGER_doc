import express from "express"
const router = express.Router()

import { createLearning } from "../controller/learningController"


router.route("/student/learning/:id").post(createLearning)


export default router;
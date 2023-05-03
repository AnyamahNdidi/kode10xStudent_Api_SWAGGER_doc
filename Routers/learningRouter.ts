import express from "express"
const router = express.Router()

import { createLearning,retrieveOneUserLearning } from "../controller/learningController"


router.route("/student/learning/:id").post(createLearning)

router.route("/learning/:id").get(retrieveOneUserLearning)


export default router;
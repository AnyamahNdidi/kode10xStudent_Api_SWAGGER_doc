import express from "express"
const router = express.Router()

import { createLearning,retrieveOneUserLearning,getOneUserAllLearning } from "../controller/learningController"


router.route("/student/learning/:id").post(createLearning)

router.route("/learning/:id").get(retrieveOneUserLearning)

router.route("/learning/:id/all").get(getOneUserAllLearning)


export default router;
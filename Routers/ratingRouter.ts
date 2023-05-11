import express from "express"
const router = express.Router()

import {
    // createRating
    studentRating,
    getAllStudentRating
} from "../controller/ratingController"


router.route("/ratelecture/:id").post(studentRating)
router.route("/getall/studentrating/:id").get(getAllStudentRating)
 
// router.route("/ratelecture/:id").post(createRating)
export default router;
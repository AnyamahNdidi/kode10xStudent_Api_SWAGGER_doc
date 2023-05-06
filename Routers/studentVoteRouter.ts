import express from "express"
const router = express.Router()

import { createStudentForVote } from "../controller/studentVoteController"


router.route("/create/studentvote").post(createStudentForVote)

export default router;
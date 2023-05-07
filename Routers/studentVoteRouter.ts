import express from "express"
const router = express.Router()

import { createStudentForVote, voteStudent, deleteStudentVote,getVoteCandidate } from "../controller/studentVoteController"


router.route("/create/studentvote").post(createStudentForVote)

router.route("/:id/:studentID/vote").patch(voteStudent)
router.route("/:id/:studentID/deletevote").patch(deleteStudentVote)

router.route("/all/candidate").get(getVoteCandidate)

export default router;
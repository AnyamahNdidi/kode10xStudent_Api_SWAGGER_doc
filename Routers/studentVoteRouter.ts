import express from "express"
const router = express.Router()

import { createStudentForVote, voteStudent, deleteStudentVote } from "../controller/studentVoteController"


router.route("/create/studentvote").post(createStudentForVote)

router.route("/:id/:userVotingID/vote").patch(voteStudent)
router.route("/:id/:userVotingID/deletevote").patch(deleteStudentVote)

export default router;
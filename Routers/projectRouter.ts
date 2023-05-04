import express from "express"
const router = express.Router()

import { createStudentProject, getUserAllProject, getUserProjectWithLimit } from "../controller/projectController"

router.route("/create/project/:id").post(createStudentProject)

router.route("/project/:id/limit").get(getUserProjectWithLimit)
router.route("/project/:id").get(getUserAllProject)

export default router;
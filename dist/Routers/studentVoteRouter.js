"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const studentVoteController_1 = require("../controller/studentVoteController");
router.route("/create/studentvote").post(studentVoteController_1.createStudentForVote);
router.route("/:id/:studentID/vote").patch(studentVoteController_1.voteStudent);
router.route("/:id/:studentID/deletevote").patch(studentVoteController_1.deleteStudentVote);
router.route("/all/candidate").get(studentVoteController_1.getVoteCandidate);
exports.default = router;

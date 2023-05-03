"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const learningController_1 = require("../controller/learningController");
router.route("/student/learning/:id").post(learningController_1.createLearning);
router.route("/learning/:id").get(learningController_1.retrieveOneUserLearning);
exports.default = router;

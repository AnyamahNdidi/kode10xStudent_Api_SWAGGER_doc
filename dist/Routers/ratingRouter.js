"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const ratingController_1 = require("../controller/ratingController");
router.route("/ratelecture/:id").post(ratingController_1.studentRating);
router.route("/getall/studentrating/:id").get(ratingController_1.getAllStudentRating);
// router.route("/ratelecture/:id").post(createRating)
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const projectController_1 = require("../controller/projectController");
router.route("/create/project/:id").post(projectController_1.createStudentProject);
router.route("/project/:id/limit").get(projectController_1.getUserProjectWithLimit);
router.route("/project/:id").get(projectController_1.getUserAllProject);
exports.default = router;

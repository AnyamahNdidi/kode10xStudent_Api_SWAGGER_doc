"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
router.route("/register").post(userController_1.registerStudent);
router.route("/login").post(userController_1.LoginStudent);
router.route("/reset/password").post(userController_1.resetUserPassword);
router.route("/allstudent").get(userController_1.getAllStudent);
router.route("/onestudent/:id").get(userController_1.getSingleStudent);
router.route("/user/:id/password-change").patch(userController_1.changePassword);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const verifyToken_1 = require("../middlewares/verifyToken");
const galleryController_1 = require("../controller/galleryController");
const multer_1 = __importDefault(require("../utils/multer"));
router.route("/post/image").post(verifyToken_1.verify, multer_1.default, galleryController_1.postImage);
router.route("/getall/image").get(galleryController_1.getAllImage);
exports.default = router;

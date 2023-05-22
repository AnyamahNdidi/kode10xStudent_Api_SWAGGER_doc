"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllImage = exports.postImage = void 0;
const GalleryModel_1 = __importDefault(require("../Model/GalleryModel"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
/**
 * @swagger
 * components:
 *   schemas:
 *     uploadgallery:
 *       type: object
 *       required:
 *         - title
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: The user biography
 *         image:
 *           type: file
 *           description: The user biography
 *       example:
 *         title: party image
 *         image: file.jpg
 */
exports.postImage = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, image } = req.body;
        const adminuser = req.user;
        // console.log(adminuser.info.role)
        if (((_a = adminuser === null || adminuser === void 0 ? void 0 : adminuser.info) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized Only Admin Can Updload ' });
        }
        const imageupload = yield cloudinary_1.default.uploader.upload((_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.path);
        const galleryData = yield GalleryModel_1.default.create({
            title,
            image: imageupload.secure_url,
            imgaeId: imageupload.public_id
        });
        return res.status(200).json({
            message: "image uploaded sucessfully",
            data: galleryData
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in uplaoding gallery",
            message: "can't upload images to gallery",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
exports.getAllImage = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const galleryData = yield GalleryModel_1.default.find();
        return res.status(200).json({
            message: "All sucessfully",
            data: galleryData
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in uplaoding gallery",
            message: "can't upload images to gallery",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));

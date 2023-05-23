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
 *     uploadimage:
 *       type: object
 *       required:
 *         - title
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: Topice of what you learn
 *         image:
 *           type: string
 *           format: binary
 *           description: the imag file
 *       example:
 *         title: partyimage
 *         image: file.jpeg
 *       securitySchemes:
 *         Authorization:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */
/**
 * @swagger
 *  /api/post/image:
 *  post:
 *    security:
 *      - Authorization: []
 *    summary: Admin endpoint to upload image
 *    tags: [updateImage Admin]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/uploadimage'
 *    responses:
 *      200:
 *        description: The profile has been updated
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */
exports.postImage = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, image } = req.body;
        const adminuser = req.user;
        console.log(adminuser.info.role);
        if ((adminuser === null || adminuser === void 0 ? void 0 : adminuser.info.role) !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized Only Admin Can Updload ' });
        }
        const imageupload = yield cloudinary_1.default.uploader.upload((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path);
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

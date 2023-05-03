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
exports.editPic = exports.editProfile = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const profileModel_1 = __importDefault(require("../Model/profileModel"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
/**
 * @swagger
 * components:
 *   schemas:
 *     editUsers:
 *       type: object
 *       required:
 *         - bio
 *         - phoneNum
 *         - gitHubLink
 *         - linkedinLink
 *         - facebookLink
 *         - twitterLink
 *       properties:
 *         bio:
 *           type: string
 *           description: The user biography
 *         gitHubLink:
 *           type: string
 *           description: The user last name
 *         linkedinLink:
 *           type: string
 *           description: preferr stack
 *         facebookLink:
 *           type: string
 *           description: The prefeered email
 *         twitterLink:
 *           type: string
 *           description: The prefeered email
 *       example:
 *         bio: about your self........
 *         phoneNum: about your self........
 *         gitHubLink: https://github.com/gideonekeke
 *         linkedinLink: https://linkedle.com/gideonekeke
 *         facebookLink: https://facebook.com/gideonekeke
 *         twitterLink: https://teitter.com/gideonekeke
 */
/**
 * @swagger
 *  /api/edit/profile/{id}:
 *  patch:
 *    summary: Update user profile
 *    tags: [users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/editUsers'
 *    responses:
 *      200:
 *        description: The profile has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/editUsers'
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */
exports.editProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bio, gitHubLink, linkedinLink, facebookLink, twitterLink, phoneNum } = req.body;
        //  if (!bio || !gitHubLink || !linkedinLink  || !facebookLink || !twitterLink)
        //     {
        //         return res.status(400).json({message:"please enter all field"})
        // }
        const user = yield profileModel_1.default.findByIdAndUpdate(req.params.id, {
            bio,
            phoneNum,
            gitHubLink,
            linkedinLink,
            facebookLink,
            twitterLink
        }, { new: true });
        return res.status(200).json({
            message: "user info has been updated successfully",
            data: user,
        });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error edit profile",
            message: "account can not be created",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));
/**
 * @swagger
 * components:
 *   schemas:
 *     editUsersProfile:
 *       type: object
 *       required:
 *         - avatar
 *       properties:
 *         avatar:
 *           type: file
 *           description: The user biography
 *       example:
 *         avatar: file.jpg
 */
/**
 * @swagger
 *  /api/editprofile/{id}:
 *  patch:
 *    summary: Update user image profile
 *    tags: [users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/editUsersProfile'
 *    responses:
 *      200:
 *        description: The profile has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/editUsersProfile'
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */
exports.editPic = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profileUser = yield profileModel_1.default.findById(req.params.id);
        // await cloudinary.uploader.destroy(profileUser?.avatarID!);
        // let streamUpload = (req: any) => {
        // 	return new Promise(async (resolve: any, reject: any) => {
        // 		let stream: string | any = await cloudinary.uploader.upload_stream(
        // 			(error: any, result: Buffer) => {
        // 				if (result) {
        // 					return resolve(result);
        // 				} else {
        // 					console.log("reading Error: ", error);
        // 					return reject(error);
        // 				}
        // 			},
        // 		);
        // 		streamifier.createReadStream(req?.file!.buffer!).pipe(stream);
        // 	});
        // };
        // const image: any = await streamUpload(req);
        // const userProf = await profileModel.findByIdAndUpdate(
        //     req.params.id,
        //     { avatar: image.secure_url },
        //     { new: true },
        // )
        const image = yield cloudinary_1.default.uploader.upload(req === null || req === void 0 ? void 0 : req.file.path);
        const user = yield profileModel_1.default.findByIdAndUpdate(req.params.id, { avatar: image.secure_url }, { new: true });
        return res.status(200).json({
            message: "profile image updated successfully",
            data: user,
        });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error editin image profile",
            message: "account can not be created",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));

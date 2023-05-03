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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleStudent = exports.getAllStudent = exports.LoginStudent = exports.registerStudent = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
const emailvat_1 = require("../utils/emailvat");
const GenerateToken_1 = require("../utils/GenerateToken");
const profileModel_1 = __importDefault(require("../Model/profileModel"));
const mongoose_1 = __importDefault(require("mongoose"));
function generateStudentId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 4;
    let randomId = "K10X";
    for (let i = 0; i < length; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - stack
 *         - email
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user first name
 *         lastName:
 *           type: string
 *           description: The user last name
 *         stack:
 *           type: string
 *           description: preferr stack
 *         email:
 *           type: string
 *           description: The prefeered email
 *       example:
 *         firstName: john
 *         lastName: peter
 *         stack: backend engineer
 *         email: johnjames@gmail.com
 */
// the $ref is refering to the up schema 
/**
 * @swagger
 * /api/register:
 *   post:
 *      description: Used to register user
 *      tags:
 *          - Create User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/users'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
exports.registerStudent = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, stack } = req.body;
        if (!email || !firstName || !lastName || !stack) {
            return res.status(400).json({ message: "please enter all field" });
        }
        const usesExist = yield userMondel_1.default.findOne({ email });
        if (usesExist) {
            return res.status(401).json({ message: "email already exist" });
        }
        const studentData = yield userMondel_1.default.create({
            email,
            firstName,
            lastName,
            stack,
            studentID: generateStudentId()
        });
        const profileData = yield profileModel_1.default.create({
            _id: studentData._id,
            bio: "",
            gitHubLink: "",
            facebookLink: "",
            linkedinLink: "",
            twitterLink: "",
            phoneNum: ""
        });
        studentData === null || studentData === void 0 ? void 0 : studentData.profile.push(new mongoose_1.default.Types.ObjectId(profileData === null || profileData === void 0 ? void 0 : profileData._id));
        studentData === null || studentData === void 0 ? void 0 : studentData.save();
        profileData.user = studentData._id;
        profileData.save();
        (0, emailvat_1.AdminServiceEmail)(studentData.firstName, studentData.lastName, studentData.studentID)
            .then((result) => {
            console.log("message been sent to you: ");
        })
            .catch((error) => console.log(error));
        const _a = studentData._doc, { studenID } = _a, info = __rest(_a, ["studenID"]);
        return res.status(201).json({
            message: "  Registration successful Go To Admin to recieve Login id",
            data: info,
        });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error creating user",
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
 *     loginUsers:
 *       type: object
 *       required:
 *         - studentID
 *       properties:
 *         studentID:
 *           type: string
 *           description: user can log in
 *     example:
 *       studentID: K10Xo2p6
 */
/**
 * @swagger
 * /api/login:
 *   post:
 *      description: endpoint for student login
 *      tags:
 *          - Login User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/loginUsers'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
exports.LoginStudent = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentID } = req.body;
        if (!studentID) {
            return res.status(400).json({ mesage: "field can't be empty" });
        }
        const checkId = yield userMondel_1.default.findOne({ studentID }).populate({
            path: "profile",
            options: { createdAt: -1 }
        });
        if (checkId) {
            const info = __rest(checkId._doc, []);
            const token = (0, GenerateToken_1.TokenGenerator)({ info });
            return res.status(ErrorDefinder_1.HTTP.OK).json({
                message: "login success",
                data: info,
                token: token
            });
        }
        else {
            return res.status(ErrorDefinder_1.HTTP.BAD_REQUEST).json({
                messeage: "StudentID can't be  found",
            });
        }
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error in Loging User",
            message: "user can login in",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));
/**
 * @swagger
 * components:
 *   schemas:
 *     getAllusers:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - stack
 *         - email
 *       properties:
 *         firtsName:
 *           type: string
 *           description: user first name
 *         lastName:
 *           type: string
 *           description: user last name
 *         stack:
 *           type: string
 *           description: user prefer stack
 *         email:
 *           type: string
 *           description: user phone number
 *       example:
 *         firstName: john
 *         lastName: Alexande
 *         stack: full stack Engineer
 *         phoneNum: 09081713598
 *         email: theo4felix@gmail.com

 */
/**
 * @swagger
 * /api/allstudent:
 *   get:
 *     summary: Returns the list of all the students
 *     tags: [users]
 *     responses:
 *       200:
 *         description: The list of the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/getAllusers'
 */
exports.getAllStudent = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUser = yield userMondel_1.default.find().populate({
            path: "profile",
            options: { createdAt: -1 }
        }).populate({
            path: "studentLearning",
            options: { createdAt: -1 }
        });
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "created",
            data: allUser,
        });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error in Fetchibg all User",
            message: "can get all user",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));
/**
 * @swagger
 * /api/onestudent/{id}:
 *   get:
 *     summary: Get a single student by id
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getAllusers'
 *       404:
 *         description: The student was not found
 */
exports.getSingleStudent = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oneUser = yield userMondel_1.default.findById(req.params.id).populate({
            path: "profile",
            options: { createdAt: -1 }
        }).populate({
            path: "studentLearning",
            options: { createdAt: -1 }
        });
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "get One User",
            data: oneUser,
        });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error in Fetchibg all User",
            message: "can get all user",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));

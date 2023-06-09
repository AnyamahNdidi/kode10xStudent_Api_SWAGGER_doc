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
exports.getOneUserAllLearning = exports.retrieveOneUserLearning = exports.createLearning = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const learningModel_1 = __importDefault(require("../Model/learningModel"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @swagger
 * components:
 *   schemas:
 *     studentlearning:
 *       type: object
 *       required:
 *         - title
 *         - decs
 *         - course
 *       properties:
 *         title:
 *           type: string
 *           description: Topice of what you learn
 *         decs:
 *           type: string
 *           description: brief description of what you learn
 *         course:
 *           type: string
 *           description: state the course you are in for
 *       example:
 *         title: DataTypes
 *         decs: i learn how to clear varaible
 *         course: javascript
 */
/**
 * @swagger
 * /api/student/learning/{id}:
 *   post:
 *      summary: endpoint for creating leaning
 *      tags: [learning]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The student id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/studentlearning'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
exports.createLearning = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, decs, course } = req.body;
        if (!title || !decs || !course) {
            return res.status(400).json({ mesage: "please enter all field" });
        }
        const getStudent = yield userMondel_1.default.findById(req.params.id);
        const createStudentLearning = yield learningModel_1.default.create({
            title,
            decs,
            course,
        });
        createStudentLearning.user = getStudent;
        createStudentLearning.save();
        getStudent === null || getStudent === void 0 ? void 0 : getStudent.studentLearning.push(new mongoose_1.default.Types.ObjectId(createStudentLearning === null || createStudentLearning === void 0 ? void 0 : createStudentLearning._id));
        getStudent.save();
        const _a = createStudentLearning._doc, { project, profile, studentLearning } = _a, info = __rest(_a, ["project", "profile", "studentLearning"]);
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "learning  created successfully",
            data: createStudentLearning
        });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error creating leerning",
            message: "account can not be created",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));
/**
 * @swagger
 * /api/learning/{id}:
 *   get:
 *     summary: Get a user learnig with limit of 3
 *     tags: [learning]
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
exports.retrieveOneUserLearning = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getLearning = yield userMondel_1.default.findById(req.params.id).populate({
            path: "studentLearning",
            options: {
                limit: 3,
                sort: { createdAt: -1 },
            },
        });
        const _b = getLearning._doc, { project, profile } = _b, info = __rest(_b, ["project", "profile"]);
        res.status(ErrorDefinder_1.HTTP.OK).json({
            status: "successful",
            data: info,
        });
    }
    catch (err) {
        new ErrorDefinder_1.mainAppError({
            name: "Error i showing leerning",
            message: "can't display learning",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));
/**
 * @swagger
 * /api/learning/{id}/all:
 *   get:
 *     summary: Get a user learninfg with no limit
 *     tags: [learning]
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
exports.getOneUserAllLearning = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getLearning = yield userMondel_1.default.findById(req.params.id).populate({
            path: "studentLearning",
            options: {
                sort: { createdAt: -1 },
            },
        });
        const _c = getLearning._doc, { project, profile, studentID } = _c, info = __rest(_c, ["project", "profile", "studentID"]);
        res.status(ErrorDefinder_1.HTTP.OK).json({
            status: "successful get all learning",
            data: info,
        });
    }
    catch (err) {
        new ErrorDefinder_1.mainAppError({
            name: "Error i showing leerning",
            message: "can't display learning",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));

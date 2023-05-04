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
exports.getUserAllProject = exports.getUserProjectWithLimit = exports.createStudentProject = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const creatProjectModel_1 = __importDefault(require("../Model/creatProjectModel"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
const userMondel_2 = __importDefault(require("../Model/userMondel"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @swagger
 * components:
 *   schemas:
 *     studentProject:
 *       type: object
 *       required:
 *         - title
 *         - decs
 *         - url
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
 *         title: online store
 *         decs: allow user to order stuff online
 *         url: https://www.jumia.com
 */
/**
 * @swagger
 * /api/create/project/{id}:
 *   post:
 *      summary: allow student to uplaod their project
 *      tags: [projects]
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
 *              $ref: '#/components/schemas/studentProject'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
exports.createStudentProject = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, decs, url } = req.body;
        if (!title || !decs || !url) {
            return res.status(400).json({ mesage: "please enter all field" });
        }
        const getStudent = yield userMondel_2.default.findById(req.params.id);
        const projectData = yield creatProjectModel_1.default.create({
            title,
            decs,
            url,
            projectType: "web Application",
        });
        projectData.user = getStudent,
            projectData.save();
        getStudent === null || getStudent === void 0 ? void 0 : getStudent.project.push(new mongoose_1.default.Types.ObjectId(projectData === null || projectData === void 0 ? void 0 : projectData._id));
        getStudent === null || getStudent === void 0 ? void 0 : getStudent.save();
        return res.status(201).json({
            status: "project created successfully",
            data: projectData,
        });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error creating student Project",
            message: "account can not be created",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));
/**
 * @swagger
 * /api/project/{id}/limit:
 *   get:
 *     summary: Get a student project with limit of 3
 *     tags: [projects]
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
 *               $ref: '#/components/schemas/studentProject'
 *       404:
 *         description: The student was not found
 */
exports.getUserProjectWithLimit = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getProject = yield userMondel_1.default.findById(req.params.id).populate({
            path: "project",
            options: {
                limit: 3,
                sort: { createdAt: -1 },
            },
        });
        const _a = getProject._doc, { studentLearning, profile } = _a, info = __rest(_a, ["studentLearning", "profile"]);
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
 * /api/project/{id}:
 *   get:
 *     summary: Get a student all project with no limit
 *     tags: [projects]
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
 *               $ref: '#/components/schemas/studentProject'
 *       404:
 *         description: The student was not found
 */
exports.getUserAllProject = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getProject = yield userMondel_1.default.findById(req.params.id).populate({
            path: "project",
            options: {
                sort: { createdAt: -1 },
            },
        });
        const _b = getProject._doc, { studentLearning, profile } = _b, info = __rest(_b, ["studentLearning", "profile"]);
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

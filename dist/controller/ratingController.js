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
exports.getAllStudentRating = exports.studentRating = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const ratingModel_1 = __importDefault(require("../Model/ratingModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
/**
 * @swagger
 * components:
 *   schemas:
 *     studentrating:
 *       type: object
 *       required:
 *         - allweeklyrating
 *       properties:
 *         allweeklyrating:
 *           type: array
 *           description: should it an array of object containing course and rating
 *       example:
 *         allweeklyrating:
 *           - course: "javascript"
 *             rate: 4
 *           - course: "html"
 *             rate: 7
 *           - course: "typescript"
 *             rate: 7
 */
/**
 * @swagger
 * /api/ratelecture/{id}:
 *   post:
 *      summary: endpoint sudent to rate their learning
 *      tags: [rating course]
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
 *              $ref: '#/components/schemas/studentrating'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
exports.studentRating = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentInfo = yield userMondel_1.default.findById(req.params.id);
        console.log("gvdjhbk", studentInfo);
        if (!studentInfo) {
            next(new ErrorDefinder_1.mainAppError({
                name: "",
                message: "student is not register",
                status: ErrorDefinder_1.HTTP.BAD_REQUEST,
                isSuccess: false
            }));
        }
        const ratingUser = yield req.body.allweeklyrating.map((rating) => {
            return {
                course: rating.course,
                rate: rating.rate,
            };
        });
        console.log(ratingUser);
        let properDate = new Date();
        let year = properDate.getFullYear();
        let month = properDate.toLocaleString("en-US", { month: "long" });
        let day = properDate.toLocaleString("en-US", { day: "2-digit" });
        console.log("kvdf", year, month, day);
        const createRatin = yield ratingModel_1.default.create({
            allweeklyrating: ratingUser,
            properDate: day + " " + month + " " + year
        });
        studentInfo === null || studentInfo === void 0 ? void 0 : studentInfo.weeklyratingcourse.push(new mongoose_1.default.Types.ObjectId(createRatin === null || createRatin === void 0 ? void 0 : createRatin._id));
        studentInfo.save();
        return res.status(ErrorDefinder_1.HTTP.CREATED).json({
            message: "rating successfully",
            data: createRatin,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `useert ${err.message}`
        });
    }
}));
/**
 * @swagger
 * /api/getall/studentrating/{id}:
 *   get:
 *     summary: used to get all student rating
 *     tags: [rating course]
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
 *               $ref: '#/components/schemas/studentrating'
 *       404:
 *         description: The student was not found
 */
exports.getAllStudentRating = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getStat = yield userMondel_1.default.findById(req.params.id).populate({
            path: "weeklyratingcourse",
            select: 'date allweeklyrating properDate',
            options: { createdAt: -1 }
        });
        const _a = getStat === null || getStat === void 0 ? void 0 : getStat._doc, { profile, studentLearning, project } = _a, info = __rest(_a, ["profile", "studentLearning", "project"]);
        res.status(201).json({
            status: "stat record has been added successfully",
            data: info,
        });
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in Fetchibg  one student rating",
            message: "can get all user",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));
// export const createRating = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
//     try
//     { 
//         const studentInfo:any = await studentModel.findById(req.params.id)
//         if (!studentInfo) {
//         next(
//           new mainAppError({
//             name: "",
//             message: "student is not register",
//             status: HTTP.BAD_REQUEST,
//             isSuccess:false
//         })
//         );
//       }
//          const ratingUser = await req.body.studentrating.map((rating:any) => {
//             return {
//                 course: rating.course,
//                 rate: rating.rate,
//             }
//         })
//         const studentrating = {
//                 $push: {
//                     // Set the value of the 'trk' field to an array containing two objects
//                     studentrating: ratingUser
//                 }
// };
//           console.log(typeof req.body.studentrating)
//         await studentModel.updateOne(studentInfo, studentrating )
//         // console.log(ratingUser)
//         // studentInfo?.studentrating.push(ratingUser)
//         // studentInfo?.save()
//         return res.status(HTTP.CREATED).json({
//             message: "rating successfully",
//         })
//     } catch (err:any)
//     {
//          return res.status(500).json({
//             message: `useert ${err.message}`
//         })
//     }
// })

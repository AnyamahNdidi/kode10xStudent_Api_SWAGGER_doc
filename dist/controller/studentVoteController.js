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
exports.getVoteCandidate = exports.deleteStudentVote = exports.voteStudent = exports.createStudentForVote = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const studentVote_1 = __importDefault(require("../Model/studentVote"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
/**
 * @swagger
 * components:
 *   schemas:
 *     nominatecandidate:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         firstName:
 *           type: string
 *           description: register student first name
 *         lastName:
 *           type: string
 *           description: resgister student last Name
 *       example:
 *         firstName: john
 *         lastName: deo
 */
/**
 * @swagger
 * /api/create/studentvote:
 *   post:
 *      summary: this end allows admin to create nominee for student to vote
 *      tags: [student vote]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/nominatecandidate'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
exports.createStudentForVote = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "please enter all field" });
        }
        const checkStudent = yield userMondel_1.default.find({ lastName, firstName }).populate("profile").exec();
        // console.log(checkStudent)
        if (checkStudent.length > 0) {
            const checkCandidate = yield studentVote_1.default.find({ lastName, firstName }).exec();
            console.log(checkCandidate);
            if (checkCandidate.length > 0) {
                return res.status(301).json({
                    message: "candidate has already been nominated  choose another one",
                    data: checkCandidate[0]
                });
            }
            let createStudent = {
                firstName: checkStudent[0].firstName,
                lastName: checkStudent[0].lastName,
                fullName: checkStudent[0].firstName + checkStudent[0].lastName,
                image: checkStudent[0].profile[0].avatar,
                role: "student of the week",
                gitHubLink: checkStudent[0].profile[0].gitHubLink
            };
            const createCandidate = yield studentVote_1.default.create(createStudent);
            return res.status(201).json({
                Message: "candidate has been added ",
                data: createCandidate
            });
        }
        else {
            return res.status(404).json({
                message: `invalid candidate no student is bearing ${firstName} ${lastName} check properly`
            });
        }
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error in createing candidate for vote",
            message: "account can not be created",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));
/**
 * @swagger
 * /api/{id}/{studentID}/vote:
 *   patch:
 *     summary: endpoint that allows student to vote for favourties candidate
 *     tags: [student vote]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The nominate id
 *       - in: path
 *         name: studentID
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
 *               $ref: '#/components/schemas/nominatecandidate'
 *       404:
 *         description: The student was not found
 */
exports.voteStudent = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const studentID = req.params.studentID;
        let checkItem = yield studentVote_1.default.find({ user: { $in: [studentID] } }).exec();
        console.log("check", checkItem);
        if (!(checkItem.length > 0)) {
            const voted = yield studentVote_1.default.findByIdAndUpdate(id, {
                $push: { user: studentID },
            }, { new: true });
            const getUser = yield studentVote_1.default.findById(id);
            const votersData = getUser === null || getUser === void 0 ? void 0 : getUser.user.length;
            yield studentVote_1.default.findByIdAndUpdate(req.params.id, {
                voters: votersData,
            }, { new: true });
            console.log(votersData);
            return res.status(201).json({
                message: "vote casted sucessfully",
                data: {
                    numberOfVote: votersData,
                    voted
                }
            });
        }
        else {
            return res.status(201).json({
                message: 'user has already voted before'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: `${error.message}`
        });
        //    new mainAppError({
        //     name: "Error voting for student",
        //     message: "account can not be created",
        //     status: HTTP.BAD_REQUEST,
        //     isSuccess:false
        // })
    }
}));
/**
 * @swagger
 * /api/{id}/{studentID}/deletevote:
 *   patch:
 *     summary: endpoint that allows student to unvote
 *     tags: [student vote]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The nominate id
 *       - in: path
 *         name: studentID
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
 *               $ref: '#/components/schemas/nominatecandidate'
 *       404:
 *         description: The student was not found
 */
exports.deleteStudentVote = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const studentID = req.params.studentID;
        let checkItem = yield studentVote_1.default.find({ user: { $in: [studentID] } }).exec();
        // console.log("check", checkItem)
        if (checkItem.length > 0) {
            const voted = yield studentVote_1.default.findByIdAndUpdate(id, {
                $pull: { user: studentID },
            }, { new: true });
            const getUser = yield studentVote_1.default.findById(id);
            const votersData = getUser === null || getUser === void 0 ? void 0 : getUser.user.length;
            yield studentVote_1.default.findByIdAndUpdate(req.params.id, {
                voters: votersData,
            }, { new: true });
            console.log(votersData);
            return res.status(201).json({
                message: "vote has been deleted",
            });
        }
        else {
            return res.status(201).json({
                message: 'You have not cast any vote so why do you want to delete vote'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: `${error.message}`
        });
        //    new mainAppError({
        //     name: "Error voting for student",
        //     message: "account can not be created",
        //     status: HTTP.BAD_REQUEST,
        //     isSuccess:false
        // })
    }
}));
/**
 * @swagger
 * components:
 *   schemas:
 *     getAllvotingcandidate:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - fullName
 *         - role
 *         - gitHubLink
 *         - image
 *         - user
 *         - voters
 *       properties:
 *         firtsName:
 *           type: string
 *           description: user first name
 *         lastName:
 *           type: string
 *           description: user last name
 *         fullName:
 *           type: string
 *           description: full name of user
 *         role:
 *           type: string
 *           description: role candidate is nominated for
 *         gitHubLink:
 *           type: string
 *           description: candidate git hub repo
 *         user:
 *           type: array
 *           description: all voters id
 *         image:
 *           type: string
 *           description: candidate image
 *         voters:
 *           type: number
 *           description: total vote of candidate
 *       example:
 *         firstName: john
 *         lastName: Alexande
 *         fullName: john Alexande
 *         role: student of the week
 *         gitHubLink: https://github.com/johnAlexande
 *         user: ["94859449","94854"]
 *         image: https://avatars.githubusercontent.com/
 *         voters: 1
 */
/**
 * @swagger
 * /api/all/candidate:
 *   get:
 *     summary: Returns the list of all candidates
 *     tags: [student vote]
 *     responses:
 *       200:
 *         description: The list of the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/getAllvotingcandidate'
 */
exports.getVoteCandidate = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readAllVOte = yield studentVote_1.default.find();
        return res.status(ErrorDefinder_1.HTTP.OK).json({ message: "Reading all Voters", data: readAllVOte });
    }
    catch (error) {
        new ErrorDefinder_1.mainAppError({
            name: "Error in getting all voted student",
            message: "account can not be created",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        });
    }
}));

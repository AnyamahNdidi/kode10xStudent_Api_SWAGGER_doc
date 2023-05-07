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
exports.deleteStudentVote = exports.voteStudent = exports.createStudentForVote = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const studentVote_1 = __importDefault(require("../Model/studentVote"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
exports.createStudentForVote = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "please enter all fiembld" });
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
                fullName: checkStudent[0].lastName + checkStudent[0].lastName,
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
exports.voteStudent = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userVotingID = req.params.userVotingID;
        let checkItem = yield studentVote_1.default.find({ user: { $in: [userVotingID] } }).exec();
        console.log("check", checkItem);
        if (!(checkItem.length > 0)) {
            const voted = yield studentVote_1.default.findByIdAndUpdate(id, {
                $push: { user: userVotingID },
            }, { new: true });
            const getUser = yield studentVote_1.default.findById(id);
            const votersData = getUser === null || getUser === void 0 ? void 0 : getUser.user.length;
            yield studentVote_1.default.findByIdAndUpdate(req.params.id, {
                voter: votersData,
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
                message: 'user has  already voted before'
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
exports.deleteStudentVote = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userVotingID = req.params.userVotingID;
        let checkItem = yield studentVote_1.default.find({ user: { $in: [userVotingID] } }).exec();
        console.log("check", checkItem);
        if (checkItem.length > 0) {
            const voted = yield studentVote_1.default.findByIdAndUpdate(id, {
                $pull: { user: userVotingID },
            }, { new: true });
            const getUser = yield studentVote_1.default.findById(id);
            const votersData = getUser === null || getUser === void 0 ? void 0 : getUser.user.length;
            yield studentVote_1.default.findByIdAndUpdate(req.params.id, {
                voter: votersData,
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

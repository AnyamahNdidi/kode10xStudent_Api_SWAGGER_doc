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
exports.createStudentForVote = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
exports.createStudentForVote = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "please enter all fiembld" });
        }
        const checkStudent = yield userMondel_1.default.find({ $or: [{ lastName: lastName }, { firstName: firstName }] }).exec();
        if (!checkStudent) {
            //      return res.status(404).json({
            //     message: `candidate ${firstName} ${lastName} has already been nominate`
            // const checkCandidate = await studentVote.find({ firstName: firstName, lastName: lastName })
            // if (!checkCandidate)
            // {
            //       return res.status(201).json({
            //     message:"student sucessfully nominated"
            // })
            // } else
            // {
            //      return res.status(404).json({
            //     message: `candidate ${firstName} ${lastName} has already been nominate`
            // });
            // }
            return res.status(201).json({
                message: `sucessfully added candidate`
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

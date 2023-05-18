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
exports.registerAdmin = void 0;
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const AsyncHandler_1 = require("../AsyncHandler");
const GenerateToken_1 = require("../utils/GenerateToken");
const profileModel_1 = __importDefault(require("../Model/profileModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
exports.registerAdmin = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, email, password } = req.body;
        if (!firstName || !email || !password) {
            return res.status(400).json({ message: "please enter all field" });
        }
        const usesExist = yield userMondel_1.default.findOne({ email });
        if (usesExist) {
            return res.status(401).json({ message: "email already exist" });
        }
        const role = req.body.role || 'admin';
        const adminData = yield userMondel_1.default.create({
            firstName,
            email,
            password,
            role,
        });
        const profileData = yield profileModel_1.default.create({
            _id: adminData._id,
            // bio: "",
            // gitHubLink: "",
            // youtubeUrl:"",
            // facebookLink: "",
            // linkedinLink: "",
            // twitterLink: "",
            // phoneNum: "",  
        });
        adminData === null || adminData === void 0 ? void 0 : adminData.profile.push(new mongoose_1.default.Types.ObjectId(profileData === null || profileData === void 0 ? void 0 : profileData._id));
        adminData === null || adminData === void 0 ? void 0 : adminData.save();
        profileData.user = profileData._id;
        profileData.save();
        const token = (0, GenerateToken_1.TokenGenerator)({ _id: adminData === null || adminData === void 0 ? void 0 : adminData._id, email: adminData === null || adminData === void 0 ? void 0 : adminData.email, role: adminData === null || adminData === void 0 ? void 0 : adminData.role });
        return res.status(ErrorDefinder_1.HTTP.OK).json({
            message: "login success",
            data: adminData,
            token: token
        });
    }
    catch (err) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in Creating Admin",
            message: "can't register admin",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
}));

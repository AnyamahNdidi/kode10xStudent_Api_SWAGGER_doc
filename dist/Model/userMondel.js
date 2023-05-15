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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel = new mongoose_1.default.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    stack: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    cohort: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin", "super-admin"],
        default: "user",
    },
    matricNumber: {
        type: String
    },
    profile: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "profiles"
        }],
    project: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "projects"
        }],
    weeklyratingcourse: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "courseratings"
        }],
    // studentrating: [{
    // 		    course: { type: String, required: true },
    // 			rate: { type: Number, required: true },
    // 			// portion: { type: Number, default: 1 },
    // 		}],
    studentLearning: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "learnings"
        }]
}, {
    timestamps: true,
});
userModel.methods.matchPassword = function (enterpassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(enterpassword, this.password);
    });
};
userModel.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
    });
});
exports.default = mongoose_1.default.model("users", userModel);

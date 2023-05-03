"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
    studentID: {
        type: String
    },
    profile: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "profiles"
        }],
    studentLearning: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "learnings"
        }]
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("users", userModel);

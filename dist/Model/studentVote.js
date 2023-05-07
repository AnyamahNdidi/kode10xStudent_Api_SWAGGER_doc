"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentVoteModel = new mongoose_1.default.Schema({
    voter: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    fullName: {
        type: String
    },
    role: {
        type: String
    },
    gitHubLink: {
        type: String
    },
    image: {
        type: String,
    },
    imageID: {
        type: String
    },
    user: [{
            type: String
        }]
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("voteStudents", studentVoteModel);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const learningModel = new mongoose_1.default.Schema({
    title: {
        type: String
    },
    decs: {
        type: String
    },
    projectType: {
        type: String
    },
    tools: { type: Array, "default": [] },
    url: {
        type: String
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("projects", learningModel);

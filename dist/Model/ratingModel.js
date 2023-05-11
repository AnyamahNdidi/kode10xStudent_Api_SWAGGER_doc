"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ratindModel = new mongoose_1.default.Schema({
    date: {
        type: String,
        default: new Date()
    },
    properDate: {
        type: String,
    },
    allweeklyrating: [{
            course: { type: String, required: true },
            rate: { type: Number, required: true },
        }],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("courseratings", ratindModel);

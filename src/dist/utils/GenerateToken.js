"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGenerator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TokenGenerator = (data) => {
    return jsonwebtoken_1.default.sign(data, "thisisthesecrect", { expiresIn: "2d" });
};
exports.TokenGenerator = TokenGenerator;

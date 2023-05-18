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
exports.verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AsyncHandler_1 = require("../AsyncHandler");
exports.verify = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization) {
        try {
            token = req.headers.authorization.split(" ")[1];
            jsonwebtoken_1.default.verify(token, "thisisthesecrect", (err, decodedToken) => {
                if (err) {
                    return res.status(403).json({ message: 'Failed to authenticate token' });
                }
                // Set the decoded token in the request object for later use
                req.user = decodedToken;
                next();
            });
        }
        catch (error) {
            return res.status(400).json({
                message: `not authorization token failed ${error.message}`
            });
        }
    }
    if (!token) {
        return res.status(401).json({ message: `not authorization, no token provided` });
    }
}));

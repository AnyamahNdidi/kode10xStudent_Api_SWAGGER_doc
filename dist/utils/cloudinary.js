"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary = cloudinary_1.default.v2;
// import dotenv from "dotenv";
// dotenv.config();
cloudinary.config({
    cloud_name: "ndtech",
    api_key: "414962129865933",
    api_secret: "HwOGA6ka8RsN0gI4Adr_xnFD05M",
});
exports.default = cloudinary;

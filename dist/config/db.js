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
const MONGODB_URI = process.env.DATABASE_URL || "mongodb://0.0.0.0:27017/studenPortal";
const ONLINE_URL = "mongodb+srv://user:NigeriaSecurity240$@cluster0.zc4mc02.mongodb.net/studentPortal";
const connectMongoose = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(ONLINE_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        console.log(`error ${error}`);
        process.exit();
    }
});
exports.default = connectMongoose;

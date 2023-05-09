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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userMondel_1 = __importDefault(require("../Model/userMondel"));
const GOOGLE_CLIENT_ID = "672291155509-ornlhf2609fcu4107nkn8d74s2s9un8r.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "889964072554-4hvb40gtdicibq5i4n51tduaoe2mfpsl.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback",
    scope: ["email", "profile"],
}, function (accessToken, refreshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("this is profle", profile);
        const user = yield userMondel_1.default.findOne({ email: profile._json.email });
        if (user) {
            return cb(null, user);
        }
        else {
            const newUser = yield userMondel_1.default.create({ email: profile._json.email });
            return cb(null, newUser);
        }
    });
}));
passport_1.default.serializeUser((user, done) => {
    return done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    return done(null, user);
});

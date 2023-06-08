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
exports.resetStudentPassword = exports.AdminServiceEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const GOOGLE_SECRET = "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";
const GOOGLE_ID = "526763411906-dab729ct9f2tsuqpmb6uv30t7kp9a584.apps.googleusercontent.com";
const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESHTOKEN = "1//04Y5AsDKQNfTvCgYIARAAGAQSNwF-L9IrlXB3BZV31aPR2nzemx4DkcLXimEb9aD4eIngPXPQ_gW2-Rt8N3LdFNGA-gkmDKTc0Sc";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });
const url = "https://portal.kode10x.com";
const AdminServiceEmail = (firstName, lastName, matricNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "shotkode123@gmail.com",
                refreshToken: GOOGLE_REFRESHTOKEN,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: accessToken,
            }
        });
        const buildFile = path_1.default.join(__dirname, "../views/AdminVerification.ejs");
        const data = yield ejs_1.default.renderFile(buildFile, { firstName, lastName, matricNumber });
        const mailOption = {
            from: "verify your Account ",
            to: "info.code10x@gmail.com",
            subject: "Account Verification",
            html: data,
        };
        transport.sendMail(mailOption).then(() => {
            console.log("sent");
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.AdminServiceEmail = AdminServiceEmail;
const resetStudentPassword = (user, myToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "shotkode123@gmail.com",
                refreshToken: GOOGLE_REFRESHTOKEN,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: accessToken,
            }
        });
        const buildFile = path_1.default.join(__dirname, "../views/Forgetpassword.ejs");
        const data = yield ejs_1.default.renderFile(buildFile, {
            id: user === null || user === void 0 ? void 0 : user._id,
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            url,
            myToken
        });
        const mailOptions = {
            from: "KODE10X 💻💻 <info.code10x@gmail.com>",
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "Reset Password",
            html: data,
        };
        transport.sendMail(mailOptions);
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.resetStudentPassword = resetStudentPassword;

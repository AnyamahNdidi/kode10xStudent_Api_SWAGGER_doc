"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ErrorHandler_1 = require("./middlewares/ErrorHandler");
const studentRouter_1 = __importDefault(require("./Routers/studentRouter"));
const learningRouter_1 = __importDefault(require("./Routers/learningRouter"));
const profileEditRouter_1 = __importDefault(require("./Routers/profileEditRouter"));
const projectRouter_1 = __importDefault(require("./Routers/projectRouter"));
const studentVoteRouter_1 = __importDefault(require("./Routers/studentVoteRouter"));
const passport_1 = __importDefault(require("passport"));
const cookie_session_1 = __importDefault(require("cookie-session"));
require("./controller/socailController");
const mainApp = (app) => {
    app.use(express_1.default.json()).use((0, cors_1.default)())
        .use("/api", studentRouter_1.default)
        .use("/api", learningRouter_1.default)
        .use("/api", profileEditRouter_1.default)
        .use("/api", projectRouter_1.default)
        .use("/api", studentVoteRouter_1.default)
        .use((0, cookie_session_1.default)({
        name: "session",
        keys: ["key1", "keys2"],
        maxAge: 24 * 60 * 60 * 1000
    }))
        .use((req, res, next) => {
        if (req.session && !req.session.regenerate) {
            req.session.regenerate = (cb) => {
                return cb();
            };
            if (req.session && !req.session.save) {
                req.session.save = (cb) => {
                    return cb();
                };
            }
            next();
        }
    })
        .use(passport_1.default.initialize())
        .use(passport_1.default.session())
        .get("/success", (req, res) => {
        res.status(200).json({
            message: `Auth Successful `,
        });
    })
        .get("/failure", (req, res) => {
        res.status(200).json({
            message: "Something went wrong",
        });
    })
        .get('/api/auth/google/', passport_1.default.authenticate('google', { scope: ["email", 'profile'] }));
    app.get('/auth/google/callback', passport_1.default.authenticate('google', {
        successRedirect: "/success",
        failureRedirect: '/failure'
    }))
        //   .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
        .get("/", (req, res) => {
        res.status(200).json({
            message: "api is ready"
        });
    })
        .get("/api/ejs:id", (req, res) => {
        const id = req.params.id;
        const name = "edwin";
        return res.render("AdminVerification", { id, name });
    })
        .use(ErrorHandler_1.errorHandler);
};
exports.mainApp = mainApp;

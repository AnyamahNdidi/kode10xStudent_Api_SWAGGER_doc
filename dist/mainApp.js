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
const mainApp = (app) => {
    app.use(express_1.default.json()).use((0, cors_1.default)())
        .use("/api", studentRouter_1.default)
        .use("/api", learningRouter_1.default)
        .use("/api", profileEditRouter_1.default)
        .use("/api", projectRouter_1.default)
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

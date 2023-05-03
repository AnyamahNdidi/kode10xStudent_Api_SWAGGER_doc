"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mainApp_1 = require("./mainApp");
const db_1 = __importDefault(require("./config/db"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const port = 9092;
const app = (0, express_1.default)();
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
(0, mainApp_1.mainApp)(app);
(0, db_1.default)();
app.set("view engine", "ejs");
const swaggerDefinition = {
    basePath: '/',
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'Stuent portal api ',
        description: 'this is for kode10x student portal registration api build with node js',
    },
    servers: [
        { url: 'http://localhost:9092' },
    ],
    //    consumes: ['application/json'],
    produces: ['application/json']
};
const swaggerOptions = {
    swaggerDefinition,
    apis: ['./controller/*.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve);
app.get('/api-docs', swagger_ui_express_1.default.setup(swaggerDocs, { explorer: true }));
process.on("uncaughtException", (error) => {
    console.log("stop here: uncaughtException  ");
    console.log(error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("stopn here: unhandledRejection");
    console.log(reason);
    server.close(() => {
        process.exit(1);
    });
});

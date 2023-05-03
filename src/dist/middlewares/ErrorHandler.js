"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ErrorDefinder_1 = require("./ErrorDefinder");
const ErrorBuilder = (err, res) => {
    res.status(ErrorDefinder_1.HTTP.INTERNAL_SERVER_ERROR).json({
        name: err.name,
        messgae: err.message,
        status: ErrorDefinder_1.HTTP.BAD_REQUEST,
        stack: err.stack
    });
};
const errorHandler = (err, req, res, next) => {
    ErrorBuilder(err, res);
};
exports.errorHandler = errorHandler;

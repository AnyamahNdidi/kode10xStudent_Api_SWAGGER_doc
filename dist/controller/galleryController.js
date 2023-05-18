"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImage = void 0;
const AsyncHandler_1 = require("../AsyncHandler");
const ErrorDefinder_1 = require("../middlewares/ErrorDefinder");
exports.postImage = (0, AsyncHandler_1.asyncHandler)((req, res, next) => {
    try {
        const adminuser = req.user;
        if ((adminuser === null || adminuser === void 0 ? void 0 : adminuser.role) !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized Only Admin Can Updload ' });
        }
    }
    catch (error) {
        next(new ErrorDefinder_1.mainAppError({
            name: "Error in uplaoding gallery",
            message: "can't upload images to gallery",
            status: ErrorDefinder_1.HTTP.BAD_REQUEST,
            isSuccess: false
        }));
    }
});

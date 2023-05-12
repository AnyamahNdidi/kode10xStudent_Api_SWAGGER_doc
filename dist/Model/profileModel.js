"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileModel = new mongoose_1.default.Schema({
    bio: {
        type: String
    },
    phoneNum: {
        type: String
    },
    avatarID: {
        type: String
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/ndtech/image/upload/v1683028487/24-248253_user-profile-default-image-png-clipart-png-download_b7feyx.png"
    },
    gitHubLink: {
        type: String
    },
    youtubeUrl: {
        type: String
    },
    linkedinLink: {
        type: String
    },
    facebookLink: {
        type: String
    },
    twitterLink: {
        type: String
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("profiles", profileModel);

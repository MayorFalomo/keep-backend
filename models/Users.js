"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: false,
    },
    profilePic: {
        type: String,
        required: false,
        default: "https://i.pinimg.com/564x/33/f4/d8/33f4d8c6de4d69b21652512cbc30bb05.jpg",
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    notifications: {
        type: [],
        require: false,
    },
    location: {
        type: String,
        required: true,
        default: "Lagos, Nigeria",
    },
    birthday: {
        type: String,
        required: false,
        default: "April, 19th, 2023",
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model("User", UserSchema);

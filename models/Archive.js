"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ArchiveSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: false,
    },
    note: {
        type: String,
        required: false,
    },
    picture: {
        type: String,
        // default: "https://i.pinimg.com/564x/33/f4/d8/33f4d8c6de4d69b21652512cbc30bb05.jpg",
        // ref: "User",
        required: false,
    },
    drawing: {
        type: String,
        required: false,
    },
    bgImage: {
        type: String,
        required: false,
    },
    bgColor: {
        type: String,
        required: false,
    },
    remainder: {
        type: String,
        required: false,
    },
    collaborator: {
        type: String,
        required: false,
    },
    label: {
        type: String,
        required: false,
    },
    // newId: {
    //   type: String,
    //   required: false,
    // },
}, { timestamps: true });
module.exports = mongoose_1.default.model("Archive", ArchiveSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NoteSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: false,
    },
    id: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: true,
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
    location: {
        type: String,
        required: false,
    },
    remainder: {
        type: Boolean,
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
}, { timestamps: true });
module.exports = mongoose_1.default.model("Note", NoteSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PinnedSchema = new mongoose_1.default.Schema({
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
    pinnedId: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: false,
    },
    pinned: {
        type: Boolean,
        required: false,
        default: true,
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model("Pinned", PinnedSchema);

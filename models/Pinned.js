"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PinnedSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Note"
    },
    username: {
        type: String,
        required: false,
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
    location: {
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
}, {
    timestamps: true,
    collection: "pins"
});
module.exports = mongoose_1.default.model("Pinned", PinnedSchema, "pins");

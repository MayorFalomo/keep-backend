const mongoose = require("mongoose");

const PinnedSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
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
    video: {
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
      type: Array,
      required: false,
    },
    labels: {
      type: Array,
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
    canvas: {
      type: Array,
      required: false,
    },
    pinned: {
      type: Boolean,
      required: false,
      default: true,
    },
    label: {
      type: String,
      required: false,
    },
    labelId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "pins",
  }
);

module.exports = mongoose.model("Pinned", PinnedSchema, "pins");

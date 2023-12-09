const mongoose = require("mongoose");

const TrashSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
      // unique: false,
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
    remainder: {
      type: Boolean,
      required: false,
    },
    collaborator: {
      type: Array,
      required: false,
    },
    //  archivedId: {
    //   type: String,
    //   required: false,
    // },
    label: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trash", TrashSchema);

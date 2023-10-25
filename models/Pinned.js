const mongoose = require("mongoose");

const PinnedSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pinned", PinnedSchema);

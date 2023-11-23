import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
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
      type: Array,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);

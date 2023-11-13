import mongoose from "mongoose";

const PinnedSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    note: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: "Note"
      }
    ]
    ,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pinned", PinnedSchema);

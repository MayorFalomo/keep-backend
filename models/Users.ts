import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
      default:
        "https://i.pinimg.com/564x/33/f4/d8/33f4d8c6de4d69b21652512cbc30bb05.jpg",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

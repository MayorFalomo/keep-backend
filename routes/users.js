// import { Router } from "express";
const router = require("express").Router();
const User = require("../models/Users");
// const Note = require("../models/Post");

//register a new user
router.post("/register", async (req, res) => {
  try {
    //Since we imported User from our User schema component here is where we expect our information to be created for new user hence for example username: request.body(A method).username and so forth
    //This is the object we're directly pushing to mongoDb, we get the request from the frontEnd
    const newUser = new User({
      _id: req.body.id,
      userId: req.body.userId, //_id is a required field for user to be able to connect to db
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      profilePic: req.body.profilePic,
      notifications: req.body.notifications,
    });
    // console.log(newUser);
    //Here we assign the newly created user to the user variable and save() which is a mongoose method), Then we say the res.user should come in json file
    const user = await newUser.save();
    // console.log(user, "I am user")
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Route for login
router.post("/login/", async (req, res) => {
  const userId = req.body.userId;

  let user;

  try {
    user = await User.findById(userId);
    // console.log(user);
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong." });
  }

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  return res.status(200).json({ user });
});

//Get a user
router.get("/get-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    //This way hides password
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a user
router.get("/get-user/:id", async (req, res) => {
  try {
    // const user = await User.findById(req.params.userId)
    const userId = req.params.id; // Get the userId from the URL parameters
    const user = await User.findOne({ userId: userId }); // Use findOne to find the user by the userId field
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    //This way hides password
  } catch (err) {
    res.status(500).json(err);
  }
});

// Search for users by their username
router.get("/search", async (req, res) => {
  const { username, email } = req.query;

  try {
    const users = await User.findOne({
      username: { $regex: new RegExp(username, "i") },
    });

    return res.json([users]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update a users info
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const updatedNote = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true } //When this line is added whatever you update shows immediately in postman
      );
      res.status(200).json(updatedNote);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ message: "userId does not match" });
  }
});

module.exports = router;

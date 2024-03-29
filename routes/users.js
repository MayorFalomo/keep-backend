// import { Router } from "express";
const router = require("express").Router();
const User = require("../models/Users");
var cron = require("node-cron");

// const Note = require("../models/Post");

//register a new user
router.post("/register", async (req, res) => {
  try {
    //Since we imported User from our User schema component here is where we expect our information to be created for new user hence for example username: request.body(A method).username and so forth
    //This is the object we're directly pushing to mongoDb, we get the request from the frontEnd
    const newUser = new User({
      _id: req.body._id,
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
    user = await User.findOne(userId);
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
    // console.log(user, "I am user");
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    //This way hides password
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a user
router.get("/get-user/uid/:id", async (req, res) => {
  const userId = req.params.id;
  // console.log(userId);
  try {
    // const user = await User.findById(req.params.userId)
    // const userId = req.params.id; // Get the userId from the URL parameters
    const user = await User.findOne({ userId: userId }); // Use findOne to find the user by the userId field
    // const { password, ...others } = user._doc;
    res.status(200).json(user);
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
router.put("/update-userinfo/:id", async (req, res) => {
  if (req.body._id == req.params.id) {
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

router.get("/getall-users/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
});

//CRON job clears Notifications [] everyday
cron.schedule("0 0 * * *", async () => {
  try {
    const result = await User.updateMany({}, { $set: { notifications: [] } });
    console.log("Trash deleted successfully:", result);
  } catch (error) {
    console.error("Error deleting notes:", error);
  }
});

// Update all documents to include the new field
// User.updateMany({}, { $set: { pending: [] } })
//   .then((result) => {
//     console.log("Documents updated successfully:", result);
//   })
//   .catch((err) => {
//     console.error("Error updating documents:", err);
//   });

//Route to get remainders from users

module.exports = router;

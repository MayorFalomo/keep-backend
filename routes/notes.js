"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const router = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/Users");
// Creating a Note
router.post("/create-note", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newNote = new Note(req.body);
    try {
        const savedNote = yield newNote.save();
        res.status(200).json(savedNote);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//Update a note
router.put("/update-note/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //basically we're running an if check before updating the note, to check if it's the actual user
    // console.log(req.body._id, "This is _Id");
    // console.log( req.params.id, "This is Req and params ");
    if (req.body._id == req.params.id) {
        try {
            const updatedNote = yield Note.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true } //When this line is added whatever you update shows immediately in postman
            );
            res.status(200).json(updatedNote);
            console.log("Updated Note successfully");
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(400).json({ message: "userId does not match" });
    }
}));
router.get('/get-note/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let note;
    try {
        note = yield Note.findOne({ _id: id });
    }
    catch (err) {
        return res.status(404).json({ message: "Unable to find Pinned Notes" });
    }
    if (!note) {
        return res.status(404).json({ message: "Can't get this Pinned Notes" });
    }
    return res.status(200).json(note);
}));
//Route to get all the note of a single user by userId
router.get(`/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    let notes;
    try {
        notes = yield Note.find({ userId });
    }
    catch (err) {
        res.status(500).json(err);
    }
    if (!notes) {
        return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json({ notes });
}));
//get all notes for a singleUser by their userId
router.get(`/get-all-notes/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userId;
    let notes;
    try {
        notes = yield Note.find({ id }).sort({ createdAt: -1 });
    }
    catch (err) {
        res.status(500).json(err);
    }
    if (!notes) {
        return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json({ notes });
}));
//Get a particular note with a specific id
// router.put("update-note/:id", async (req:any, res:any) => {
//   try {
//     const note = await Note.findById(req.params.id);
//     // We want to get the username of a user from the post then we
//     if (note._id === req.params.id) {
//       //If username from the post(username is in the schema) is the same as username of the post in the url request, then we want the user to be able to update the post
//       try {
//         const updatedPost = await Note.findByIdAndUpdate(
//           req.params.id,
//           { $set: req.body },
//           { new: true } //Apparently by default the findByIdAndUpdate method returns the document as it was before the update,
//           //But if you set new: true, It will give you how you the object after the update was applied
//         );
//         res.status(200).json(updatedPost);
//       } catch (err) {
//         res.status(500).json(err);
//       }
//     } else {
//       res.status(401).json("You can only Update Your post"); //This else statement only runs if you try to update a post that isn't having your username
//     }
//   } catch (err) {
//     res.status(500).json(err); //This catch block only runs if the Id of the user isn't matching
//   }
// });
module.exports = router; // Export the router instance

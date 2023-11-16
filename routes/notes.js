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
//Route to get a single note
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
router.get(`/getall-notes/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.post("/set-notification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const postId = req.body._id;
    let remainder;
    let user;
    const noteDetails = {
        _id: req.body._id,
        userId: req.body.userId,
        username: req.body.username,
        title: req.body.title,
        note: req.body.note,
        picture: req.body.picture,
        bgColor: req.body.bgColor,
        bgImage: req.body.bgImage,
        drawing: req.body.drawing,
        label: req.body.label,
        collaborator: req.body.collaborator,
        createdAt: req.body.createdAt, // Add the createdAt timestamp
    };
    try {
        remainder = yield User.findByIdAndUpdate({
            userId: req.body.userId,
        }, {
            $push: { notification: noteDetails },
        });
        // The notification message
        const notificationMessage = "You have notification";
        // The notification object with the message and userDetails
        const notification = Object.assign({ message: notificationMessage }, noteDetails);
        // Find the user whose post was liked and push the notification object into their notifications array
        user = yield User.findOneAndUpdate({ userId: noteDetails.userId }, { $push: { notifications: notification } });
    }
    catch (err) {
        console.log(err);
    }
    if (!remainder) {
        return res.status(404).json({ message: "Can't set Remainder" });
    }
    console.log(remainder);
    return res.status(200).json({ message: "Successfully set Remainder" });
}));
module.exports = router; // Export the router instance

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
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //basically we're running an if check before updating the note, to check if it's the actual user
    if (req.body._id == req.params.id) {
        try {
            const updatedUser = yield Note.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true } //When this line is added whatever you update shows immediately in postman
            );
            res.status(200).json(updatedUser);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(400).json({ message: "userId does not match" });
    }
}));
// router.get(`/get-notes/:id`, async (req:any, res:any) => {
//   const id = req.params.userId;
//   let notes;
//   try {
//     notes = await Note.find({ id })
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   if (!notes) {
//     return res.status(404).json({ message: "No posts found" });
//   }
//   return res.status(200).json({ notes });
// });
router.get(`/get-notes/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note.findById(req.params.id);
        res.status(200).json(note);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
module.exports = router; // Export the router instance

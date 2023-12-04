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
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const Archived = require('../models/Archive');
const Note = require('../models/Note');
router.post('/archived-notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let archived;
    const noteId = req.body._id;
    // const session = await mongoose.startSession();
    try {
        archived = new Archived({
            _id: noteId,
            userId: req.body.userId,
            username: req.body.username,
            title: req.body.title,
            note: req.body.note,
            picture: req.body.picture,
            drawing: req.body.drawing,
            bgImage: req.body.bgImage,
            bgColor: req.body.bgColor,
            remainder: req.body.remainder,
            collaborator: req.body.collaborator,
            label: req.body.label,
            location: req.body.location,
            createdAt: req.body.createdAt,
        });
        // console.log(archived);
        // await archived.save()
        // Save to Archived
        yield archived.save();
        // Remove from Note
        const existingNote = yield Note.findById(noteId);
        // console.log(existingNote, "This is existing note");
        if (!existingNote) {
            return res.status(404).json({ error: "Note not found" });
        }
        // console.log(existingNote._id, "This is existing note id");
        yield Note.findByIdAndRemove(existingNote._id);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Error while archiving notes" });
    }
    if (!archived) {
        return res.status(404).json({ message: "Couldn't add to Archive" });
    }
    return res.status(200).json({ message: "Note Archived successfully" });
}));
router.post('/unarchived-notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let unarchived;
    const noteId = req.body._id;
    try {
        unarchived = new Note({
            _id: noteId,
            userId: req.body.userId,
            username: req.body.username,
            title: req.body.title,
            note: req.body.note,
            picture: req.body.picture,
            drawing: req.body.drawing,
            bgImage: req.body.bgImage,
            bgColor: req.body.bgColor,
            remainder: req.body.remainder,
            collaborator: req.body.collaborator,
            label: req.body.label,
            location: req.body.location,
            createdAt: req.body.createdAt,
        });
        // console.log(archived);
        // Save to Archived
        yield unarchived.save();
        // Remove from Note
        const existingNote = yield Archived.findById(noteId);
        if (!existingNote) {
            return res.status(404).json({ error: "Note not found" });
        }
        yield Archived.findByIdAndRemove(existingNote._id);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Error while archiving notes" });
    }
    if (!unarchived) {
        return res.status(404).json({ message: "Couldn't add to Archive" });
    }
    return res.status(200).json({ message: "Note unArchived successfully" });
}));
router.get('/get-archived/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    let archived;
    try {
        archived = yield Archived.find({ userId: userId });
    }
    catch (err) {
        return res.status(404).json({ message: "Unable to find archived Notes" });
    }
    if (!archived) {
        return res.status(404).json({ message: "Can't get this Archive Notes" });
    }
    return res.status(200).json(archived);
}));
//Remove a Pinined Note
router.delete('/remove-archived/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let noteId = req.params.id;
    let note;
    try {
        note = yield Note.findOneAndRemove({ noteId: noteId });
    }
    catch (err) {
        console.log(err);
    }
    if (!note) {
        return res.status(404).json({ message: "Cannot remove Archived Note" });
    }
    return res.status(200).json({ message: "Archived note removed successfully" });
}));
module.exports = router; // Export the router instance

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
const Pinned = require('../models/Pinned');
const Note = require('../models/Note');
router.post('/add-pinned', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        // Check if the provided _id exists in the "Note" model
        const existingNote = yield Note.findById(_id);
        if (!existingNote) {
            return res.status(404).json({ message: "Note with the provided _id not found" });
        }
        // Create a new pinned note
        const pinned = new Pinned({
            _id: existingNote._id,
            title: existingNote.title,
            note: existingNote.note,
            picture: existingNote.picture,
            drawing: existingNote.drawing,
            bgImage: existingNote.bgImage,
            bgColor: existingNote.bgColor,
            remainder: existingNote.remainder,
            collaborator: existingNote.collaborator,
            label: existingNote.label,
            createdAt: existingNote.createdAt,
            userId: existingNote.userId,
            saved: true,
        });
        yield pinned.save();
        return res.status(200).json({ message: "Note pinned successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
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
//Route to get all the pinned notes of a singleUser
router.get('/getall-pinned-notes/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    let pinned;
    try {
        pinned = yield Pinned.find({ userId: userId });
        // console.log(pinned);
    }
    catch (err) {
        return res.status(404).json({ message: "Unable to find Pinned Notes" });
    }
    if (!pinned) {
        return res.status(404).json({ message: "Can't get this Pinned Notes" });
    }
    return res.status(200).json(pinned);
}));
//Route to find pinned of a particular user
router.get('/pinned-id/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const pinned = yield Pinned.findOne({ _id: id }).populate('note').exec();
        if (!pinned) {
            return res.status(404).json({ message: "Unable to find Pinned Notes" });
        }
        // Access pinned.notes to get the populated 'Note' documents
        // console.log(pinned.note);
        // Send the populated pinned document as the response
        res.status(200).json(pinned);
    }
    catch (err) {
        // Handle other errors, e.g., database connection issues
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
// Pinned.findById("/note-id/:id")
//   .populate("notes") // This populates the 'notes' field with actual 'Note' documents
//   .exec((err:any, pinned:any) => {
//     if (err) {
//         // Handle error
//         // console.log(err)
// return err.status(404).json({ message: "Unable to find Pinned Notes" });
//     } else {
//       // Access pinned.notes to get the populated 'Note' documents
//       console.log(pinned.notes);
//     }
//   });
// router.get('/get-pinned/:id', async (req: any, res: any, next) => {
//     const id = req.params.id;
//     let pinned;
//     try {
//         pinned = await Pinned.findOne({ _id: id });
//     } catch (err) {
//         return res.status(404).json({ message: "Unable to find Pinned Notes" })
//     }
//     if (!pinned) {
//         return res.status(404).json({ message: "Can't get this Pinned Notes" })
//     }
//     return res.status(200).json(pinned)
// });
//Remove a Pinned Note
router.delete('/remove-pinned/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let note;
    try {
        note = yield Pinned.findOneAndRemove({ _id: id });
    }
    catch (err) {
        console.log(err);
    }
    if (!note) {
        return res.status(404).json({ message: "Cannot remove Pinned Note" });
    }
    return res.status(200).json({ message: "Pinned Note removed successfully" });
}));
module.exports = router; // Export the router instance

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
router.post('/add-archived', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let archived;
    try {
        archived = new Archived({
            title: req.body.title,
            note: req.body.tweet,
            picture: req.body.picture,
            drawing: req.body.drawing,
            bgImage: req.body.bgImage,
            bgColor: req.body.bgColor,
            remainder: req.body.remainder,
            collaborator: req.body.collaborator,
            label: req.body.label,
            createdAt: req.body.createdAt,
            userId: req.body.userId,
            saved: true,
        });
        yield archived.save();
    }
    catch (err) {
        console.log(err);
    }
    if (!archived) {
        return res.status(404).json({ message: "Couldn't add to Archive" });
    }
    return res.status(200).json({ message: "Note Archived successfully" });
}));
router.get('/get-archived/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    let archived;
    try {
        archived = yield Archived.find({ userDetail: userId });
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

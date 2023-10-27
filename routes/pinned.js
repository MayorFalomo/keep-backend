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
const pinnedRouter = require('express').Router();
const Pinned = require('../models/Pinned');
router.post('/add-pinned', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pinned;
    try {
        pinned = new Pinned({
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
        yield pinned.save();
    }
    catch (err) {
        console.log(err);
    }
    if (!pinned) {
        return res.status(404).json({ message: "Couldn't add Pinned" });
    }
    return res.status(200).json({ message: "Note pinned successfully" });
}));
router.get('/get-pinned/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    let pinned;
    try {
        pinned = yield Pinned.find({ userDetail: userId });
    }
    catch (err) {
        return res.status(404).json({ message: "Unable to find Pinned Notes" });
    }
    if (!pinned) {
        return res.status(404).json({ message: "Can't get this Pinned Notes" });
    }
    return res.status(200).json(pinned);
}));
//Remove a Pinined Note
router.delete('/remove-pinned/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let noteId = req.params.id;
    let note;
    try {
        note = yield Note.findOneAndRemove({ noteId: noteId });
    }
    catch (err) {
        console.log(err);
    }
    if (!note) {
        return res.status(404).json({ message: "Can't delete this Bookmark" });
    }
    return res.status(200).json({ message: "Successfully Deleted Bookmark" });
}));

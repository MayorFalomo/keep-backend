import { Router } from "express";
const router = require('express').Router();
const Archived = require('../models/Archive');


router.post('/add-archived', async (req:any, res:any) => {
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
            userId: req.body.userId, //This would be the users id
            saved: true,
        })
        await archived.save()
    } catch (err) {
        console.log(err);
    }
    if (!archived) {
        return res.status(404).json({message: "Couldn't add to Archive"})
    }
    return res.status(200).json({message: "Note Archived successfully"})
})

router.get('/get-archived/:id', async (req:any, res:any) => {
    const userId = req.params.id;
    let archived;
    try {
        archived = await Archived.find({ userDetail: userId });
    } catch (err) {
        return res.status(404).json({ message: "Unable to find archived Notes" })
    }
    if (!archived) {
        return res.status(404).json({ message: "Can't get this Archive Notes" })
    }
    return res.status(200).json(archived)
})


//Remove a Pinined Note
router.delete('/remove-archived/:id', async (req:any, res:any) => {
    let noteId = req.params.id;
    let note;
    try {
        note = await Note.findOneAndRemove({noteId: noteId});
    } catch (err) {
        console.log(err);
    }
    if (!note) {
        return res.status(404).json({message: "Cannot remove Archived Note"})
    }
    return res.status(200).json({message: "Archived note removed successfully"})
})

module.exports = router; // Export the router instance

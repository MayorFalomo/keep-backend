import { Router } from "express";
import mongoose from "mongoose";
const router = require('express').Router();
const Archived = require('../models/Archive');
const Note = require('../models/Note');


router.post('/archived-notes', async (req:any, res:any) => {
    let archived;
    const noteId = req.body._id  
    // const session = await mongoose.startSession();
    try {
        archived = new Archived({
            _id: noteId,
            userId: req.body.userId, //This would be the users id
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
        })
        // console.log(archived);
        
        // await archived.save()
         // Save to Archived
    await archived.save();

        // Remove from Note
        const existingNote = await Note.findById(noteId);
        // console.log(existingNote, "This is existing note");
        
        if (!existingNote) {
            return res.status(404).json({ error: "Note not found" });
        }
      
        // console.log(existingNote._id, "This is existing note id");
        
        await Note.findByIdAndRemove( existingNote._id);

    } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while archiving notes" });
} 
    if (!archived) {
        return res.status(404).json({message: "Couldn't add to Archive"})
    }
    return res.status(200).json({message: "Note Archived successfully"})
})

router.post('/unarchived-notes', async (req:any, res:any) => {
    let unarchived;
    const noteId = req.body._id  
    try {
        unarchived = new Note({
            _id: noteId,
            userId: req.body.userId, //This would be the users id
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
        })
        // console.log(archived);
        
        // await archived.save()
        // Save to Archived
        await unarchived.save();

        // Remove from Note
        const existingNote = await Archived.findById(noteId);
        // console.log(existingNote, "This is existing note");
        
        if (!existingNote) {
            return res.status(404).json({ error: "Note not found" });
        }
        // console.log(existingNote._id, "This is existing note id");
        
        await Archived.findByIdAndRemove(existingNote._id);
    } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while archiving notes" });
} 
    if (!unarchived) {
        return res.status(404).json({message: "Couldn't add to Archive"})
    }
    return res.status(200).json({message: "Note unArchived successfully"})
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

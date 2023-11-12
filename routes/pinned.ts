import { Router } from "express";

const router:Router = require('express').Router();
const Pinned = require('../models/Pinned');

router.post('/add-pinned', async (req:any, res:any) => {
    let pinned;
    try {
        pinned = new Pinned({
            _id: req.body._id,
            pinnedId: req.params.pinnedId,
            title: req.body.title,
            note: req.body.note,
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
        await pinned.save()
    } catch (err) {
        console.log(err);
    }
    if (!pinned) {
        return res.status(404).json({message: "Couldn't add Pinned"})
    }
    return res.status(200).json({message: "Note pinned successfully"})
})

router.get('/getall-pinned-notes/:id', async (req: any, res: any, next) => {
    const userId = req.params.id;
    let pinned;
    try {
        pinned = await Pinned.find({ userId: userId });
    } catch (err) {
        return res.status(404).json({ message: "Unable to find Pinned Notes" })
    }
    if (!pinned) {
        return res.status(404).json({ message: "Can't get this Pinned Notes" })
    }
    return res.status(200).json(pinned)
});


router.get('/get-pinned/:id', async (req: any, res: any, next) => {
    const id = req.params.id;
    let pinned;
    try {
        pinned = await Pinned.findOne({ _id: id });
    } catch (err) {
        return res.status(404).json({ message: "Unable to find Pinned Notes" })
    }
    if (!pinned) {
        return res.status(404).json({ message: "Can't get this Pinned Notes" })
    }
    return res.status(200).json(pinned)
});

//Remove a Pinned Note
router.delete('/remove-pinned/:id', async (req, res, next) => {
    let id = req.params.id;
    let note;
    try {
        note = await Pinned.findOneAndRemove({_id: id});
    } catch (err) {
        console.log(err);
    }
    if (!note) {
        return res.status(404).json({message: "Cannot remove Pinned Note"})
    }
    return res.status(200).json({message: "Pinned Note removed successfully"})
})

module.exports = router; // Export the router instance

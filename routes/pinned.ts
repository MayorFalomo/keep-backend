const pinnedRouter = require('express').Router();
const Pinned = require('../models/Pinned')


router.post('/addPinned', async (req, res, next) => {
    let pinned;
    
    try {
        pinned = new Pinned({
            note: req.body.tweet,
            picture: req.body.picture,
           
            createdAt: req.body.createdAt,
            saved: true,
        })
        await pinned.save()
    } catch (err) {
        console.log(err);
    }
    if (!pinned) {
        return res.status(404).json({message: "Couldn't add Bookmark"})
    }
    return res.status(200).json({message: "Successfully Updated"})
})

router.get('/get-bookmark/:id', async (req, res, next) => {
    const userId = req.params.id;
    let pinned;
    try {
        pinned = await Pinned.find({ userDetail: userId });
    } catch (err) {
        return res.status(404).json({ message: "Unable to find Bookmark" })
    }
    if (!pinned) {
        return res.status(404).json({ message: "Can't get this Bookmark" })
    }
    return res.status(200).json(pinned)
})

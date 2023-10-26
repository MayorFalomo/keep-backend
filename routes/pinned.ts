const pinnedRouter = require('express').Router();
const Pinned = require('../models/Pinned');


router.post('/add-pinned', async (req:any, res:any) => {
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


router.get('/get-pinned/:id', async (req:any, res:any, next:any) => {
    const userId = req.params.id;
    let pinned;
    try {
        pinned = await Pinned.find({ userDetail: userId });
    } catch (err) {
        return res.status(404).json({ message: "Unable to find Pinned Notes" })
    }
    if (!pinned) {
        return res.status(404).json({ message: "Can't get this Pinned Notes" })
    }
    return res.status(200).json(pinned)
})

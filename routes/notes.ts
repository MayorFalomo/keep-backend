const router = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/Users");

// Creating a Note
router.post("/", async (req:any, res:any) => {
    const newNote = new Note(req.body);
    try {
        const savedNote = await newNote.save();
        res.status(200).json(savedNote);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//Update a note
router.put("/:id", async (req: any, res: any) => {
    //basically we're running an if check before updating the note, to check if it's the actual user
    if (req.body._id == req.params.id) {
        try {            
            const updatedUser = await Note.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true } //When this line is added whatever you update shows immediately in postman
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(400).json({ message: "userId does not match" });
    }
});

module.exports = router; // Export the router instance

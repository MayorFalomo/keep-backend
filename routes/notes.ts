const router = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/Users");

// Creating a Note
router.post("/create-note", async (req:any, res:any) => {
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

// router.get(`/get-notes/:id`, async (req:any, res:any) => {
//   const id = req.params.userId;
//   let notes;
//   try {
//     notes = await Note.find({ id })
//   } catch (err) {
//     res.status(500).json(err);
//   }

//   if (!notes) {
//     return res.status(404).json({ message: "No posts found" });
//   }

//   return res.status(200).json({ notes });
// });

router.get(`/get-notes/:id`, async (req:any, res:any) => {
 const id = req.params.userId;
 let notes;
 try {
   notes = await Note.find({ id }).sort({ createdAt: -1 });
 } catch (err) {
   res.status(500).json(err);
 }

 if (!notes) {
   return res.status(404).json({ message: "No posts found" });
 }

 return res.status(200).json({ notes });
});

router.get("/:id", async (req:any, res:any) => {
  try {
    const note = await Note.findById(req.params.id);
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; // Export the router instance

const router = require("express").Router();
const Pinned = require("../models/Pinned");
const Note = require("../models/Note");
const Archived = require("../models/Archive");

//Route to add a pin from Note
router.post("/add-pinned", async (req, res) => {
  try {
    const _id = req.body._id;
    // Check if the provided _id exists in the "Note" model
    const existingNote = await Note.findById(_id);
    if (!existingNote) {
      return res
        .status(404)
        .json({ message: "Note with the provided _id not found" });
    }
    // Create a new pinned note
    const pinned = new Pinned({
      _id: existingNote._id,
      username: existingNote.username,
      title: existingNote.title,
      note: existingNote.note, // Associate the note field with an existing "Note" document
      picture: existingNote.picture,
      video: existingNote.video,
      drawing: existingNote.drawing,
      bgImage: existingNote.bgImage,
      bgColor: existingNote.bgColor,
      location: existingNote.location,
      remainder: existingNote.remainder,
      collaborator: existingNote.collaborator,
      labelId: existingNote.labelId,
      label: existingNote.label,
      createdAt: req.body.createdAt,
      userId: existingNote.userId,
      canvas: existingNote.canvas,
      saved: true,
    });
    const pinNote = await Pinned.create(pinned);

    if (!pinNote) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Note pinned successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to add to Pinned and Note from Archived Notes
router.post("/add-pinned/from-archived", async (req, res) => {
  let wipeNote;
  try {
    const _id = req.body._id;

    // Check if the provided _id exists in the "Note" model
    const existingNote = await Archived.findById(_id);
    if (!existingNote) {
      return res
        .status(404)
        .json({ message: "Note with the provided _id not found" });
    }
    // console.log(existingNote, "This is exisiting Note");
    // Create a new pinned note
    const pinNote = await Pinned.create({
      _id: existingNote._id,
      username: existingNote.username,
      title: existingNote.title,
      note: existingNote.note, // Associate the note field with an existing "Note" document
      picture: existingNote.picture,
      video: existingNote.video,
      drawing: existingNote.drawing,
      bgImage: existingNote.bgImage,
      bgColor: existingNote.bgColor,
      location: existingNote.location,
      remainder: existingNote.remainder,
      collaborator: existingNote.collaborator,
      label: existingNote.label,
      labelId: existingNote.labelId,
      createdAt: req.body.createdAt,
      userId: existingNote.userId,
      saved: true,
    });
    await pinNote.save();
    console.log(pinNote, "This is pinNote");
    const newNote = await Note.create({
      _id: existingNote._id,
      username: existingNote.username,
      title: existingNote.title,
      note: existingNote.note, // Associate the note field with an existing "Note" document
      picture: existingNote.picture,
      video: existingNote.video,
      drawing: existingNote.drawing,
      bgImage: existingNote.bgImage,
      bgColor: existingNote.bgColor,
      location: existingNote.location,
      remainder: existingNote.remainder,
      collaborator: existingNote.collaborator,
      label: existingNote.label,
      labelId: existingNote.labelId,
      createdAt: req.body.createdAt,
      userId: existingNote.userId,
      saved: true,
    });
    await newNote.save();
    await Archived.findOneAndDelete({ _id: existingNote._id });
    if (!pinNote && !newNote) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res
      .status(200)
      .json({ message: "Note pinned and removed from archive successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to add to Pinned and Note from Archived Notes
router.post("/add-archived/from-pinned", async (req, res) => {
  let wipeNote;
  const _id = req.body._id;

  try {
    // Check if the provided _id exists in the "Note" model
    const existingNote = await Pinned.findById(_id);
    if (!existingNote) {
      return res
        .status(404)
        .json({ message: "Note with the provided _id not found" });
    }
    //Add Note to Archive
    const archiveNote = await Archived.create({
      _id: existingNote._id,
      username: existingNote.username,
      title: existingNote.title,
      note: existingNote.note, // Associate the note field with an existing "Note" document
      picture: existingNote.picture,
      video: existingNote.video,
      drawing: existingNote.drawing,
      bgImage: existingNote.bgImage,
      bgColor: existingNote.bgColor,
      location: existingNote.location,
      remainder: existingNote.remainder,
      collaborator: existingNote.collaborator,
      label: existingNote.label,
      labelId: existingNote.labelId,
      createdAt: req.body.createdAt,
      userId: existingNote.userId,
      saved: true,
    });
    console.log(archiveNote, "ArchiveNote");
    await archiveNote.save();
    //Find and delete the note in Pinned and Note
    await Pinned.findOneAndDelete({ _id: existingNote._id });
    await Note.findOneAndDelete({ _id: existingNote._id });
    if (!archiveNote) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    console.log("Note archived successfully");
    return res.status(200).json({ message: "Note archived successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Update all documents to include the new field
// Pinned.updateMany({}, { $set: { video: "" } })
//   .then((result) => {
//     console.log("Documents updated successfully:", result);
//   })
//   .catch((err) => {
//     console.error("Error updating documents:", err);
//   });

//Update a note
// Update a note, either pinned or regular
router.put("/update/pinned-note/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Step 1: Update Pinned Note
    const updatedPinnedNote = await Pinned.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );

    // Step 2: Find Matching Note
    const currentNote = await Note.findOne({ _id: id });
    if (!currentNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Step 3: Update Matching Note
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    // Return both updated note and pinned note
    res.status(200).json({
      updatedNote: updatedNote,
      updatedPinnedNote: updatedPinnedNote,
    });
    console.log("Updated Note and Pinned Note successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.put("/update/pinned-note/:id", async (req, res) => {
//   //basically we're running an if check before updating the note, to check if it's the actual user
//   // console.log(req.body._id, "This is _Id");
//   // console.log( req.params.id, "This is Req and params ");
//   if (req.body._id == req.params.id) {
//     try {
//       const updatedNote = await Note.findByIdAndUpdate(
//         req.params.id,
//         { $set: req.body },
//         { new: true } //When this line is added whatever you update shows immediately in postman
//       );
//       res.status(200).json(updatedNote);
//       console.log("Updated Note successfully");
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(400).json({ message: "userId does not match" });
//   }
// });

//Route to get all the pinned notes of a singleUser
// router.get("/getall-pinned-notes/:id", async (req, res) => {
//   const userId = req.params.id;

//   let pinned;
//   try {
//     pinned = await Pinned.find({ userId: userId });
//     // console.log(pinned);
//   } catch (err) {
//     return res.status(404).json({ message: "Unable to find Pinned Notes" });
//   }
//   if (!pinned) {
//     return res.status(404).json({ message: "Can't get this Pinned Notes" });
//   }
//   return res.status(200).json(pinned);
// });

//Route to get all pinned notes
router.get("/getall-pinned-notes/:id", async (req, res) => {
  const userId = req.params.id;
  // console.log(userId, "This is userId");
  try {
    // Step 1: Find user's pinned notes
    const userPinnedNotes = await Pinned.find({ userId: userId });
    // .populate("note")
    // .exec();
    // console.log(userPinnedNotes);
    if (!userPinnedNotes) {
      return res
        .status(404)
        .json({ message: "No Pinned Notes found for the user" });
    }

    //Step 2 & 3: Update and return the updated pinned notes
    const updatedPinnedNotes = await Promise.all(
      //First i map over all the notes in a users pinned notes
      userPinnedNotes.map(async (pinnedNote) => {
        //I assign the pinned note Id to the noteId variable
        const noteId = pinnedNote._id;
        // Find the current note with the _id from the Note model
        const currentNote = await Note.findOne({ _id: noteId });
        // console.log(currentNote, "This is currentNote");
        if (!currentNote) {
          return pinnedNote; // Skip the note if it's not found
        }
        // Then i'm Updating the Pinned model with the current note
        pinnedNote.note = currentNote.note;
        pinnedNote.title = currentNote.title;
        pinnedNote.picture = currentNote.picture;
        pinnedNote.video = currentNote.video;
        pinnedNote.bgColor = currentNote.bgColor;
        pinnedNote.bgImage = currentNote.bgImage;
        pinnedNote.label = currentNote.label;
        pinnedNote.labelId = currentNote.labelId;
        pinnedNote.location = currentNote.location;
        pinnedNote.canvas = currentNote.canvas;
        pinnedNote.collaborator = currentNote.collaborator;
        pinnedNote.updatedAt = currentNote.updatedAt;
        //Then i save the updated pinned note with whatever is in the currentNote field
        const updatedPinnedNote = await pinnedNote.save();
        return updatedPinnedNote; //And i return the updatedPinnedNote
      })
    );

    //Unnecessary but then i Filter out any null values
    const filteredUpdatedPinnedNotes = updatedPinnedNotes.filter(
      (note) => note !== null
    );

    // Return the updated pinned notes
    return res.status(200).json(filteredUpdatedPinnedNotes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to get a single Pinned note
router.get("/pinned-id/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const pinned = await Pinned.findOne({ _id: id }).populate("note").exec();

    if (!pinned) {
      return res.status(404).json({ message: "Unable to find Pinned Notes" });
    }
    // Access pinned.notes to get the populated 'Note' documents
    // console.log(pinned.note);

    // Send the populated pinned document as the response
    res.status(200).json(pinned);
  } catch (err) {
    // Handle other errors, e.g., database connection issues
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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

// router.get('/get-pinned/:id', async ( req, res ) => {
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
router.post("/remove-pinned/:id", async (req, res) => {
  let id = req.params.id;
  let note;
  try {
    note = await Pinned.findOneAndDelete({ _id: id });
  } catch (err) {
    console.log(err);
  }
  if (!note) {
    return res.status(404).json({ message: "Cannot remove Pinned Note" });
  }
  return res.status(200).json({ message: "Pinned Note removed successfully" });
});

router.post("/set-pinned-bgcolor", async (req, res) => {
  const _id = req.body.id;

  try {
    const note = await Pinned.findById(_id);

    if (note) {
      // console.log(note, "This is the note");
      // console.log(req.body.bgColor, "This is the color");

      note.bgColor = req.body.bgColor;
      note.bgImage = " ";
      await note.save();

      return res.status(200).json({
        message: "Background color set successfully",
        updatedNote: note,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Note not found, setting bg failed" });
    }
  } catch (err) {
    // console.error('Error setting background color:', err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to set background image for note
router.post("/set-pinned-bgimage", async (req, res) => {
  const _id = req.body.id;

  try {
    const note = await Pinned.findById(_id);

    if (note) {
      note.bgImage = req.body.bgImage;
      note.bgColor = " ";
      await note.save();

      return res.status(200).json({
        message: "Background color set successfully",
        updatedNote: note,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Note not found, setting bg failed" });
    }
  } catch (err) {
    // console.error('Error setting background color:', err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to upload picture and set it to the picture field
router.post("pinned/upload-picture", async (req, res) => {
  const _id = req.body.id;
  // console.log(_id);

  try {
    const note = await Pinned.findById(_id);

    if (note) {
      note.picture = req.body.picture;
      note.video = req.body.video;
      await note.save();

      return res.status(200).json({
        message: "picture uploaded successfully",
        updatedNote: note,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Note not found, picture upload failed" });
    }
  } catch (err) {
    // console.error('Error setting background color:', err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to upload picture and set it to the picture field
router.post("/pinned/upload-video", async (req, res) => {
  const _id = req.body.id;
  // console.log(_id);

  try {
    const note = await Pinned.findById(_id);

    if (note) {
      note.video = req.body.video;
      note.picture = req.body.picture;
      await note.save();

      return res.status(200).json({
        message: "video uploaded successfully",
        updatedNote: note,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Note not found, video upload failed" });
    }
  } catch (err) {
    // console.error('Error setting background color:', err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router; // Export the router instance

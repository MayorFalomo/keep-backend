const router = require("express").Router();
const Archived = require("../models/Archive");
const Note = require("../models/Note");
const Pinned = require("../models/Pinned");

//Route to archive a note
router.post("/archive-note", async (req, res) => {
  try {
    const archivedNote = {
      _id: req.body._id,
      userId: req.body.userId,
      username: req.body.username,
      title: req.body.title,
      note: req.body.note,
      picture: req.body.picture,
      video: req.body.video,
      canvas: req.body.canvas,
      bgImage: req.body.bgImage,
      bgColor: req.body.bgColor,
      remainder: req.body.remainder,
      collaborator: req.body.collaborator,
      label: req.body.label,
      labelId: req.body.labelId,
      location: req.body.location,
      createdAt: req.body.createdAt,
    };
    // Save to Archived
    const archived = await Archived.create(archivedNote);

    if (!archived) {
      return res.status(404).json({ message: "Couldn't add to Archive" });
    }

    // Remove from Note and Pinned
    const existingNote = await Note.findOneAndDelete({ _id: archivedNote._id });
    const existingPinned = await Pinned.findOneAndDelete({
      _id: archivedNote._id,
    });
    if (!existingNote && !existingPinned) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.status(200).json({ message: "Note Archived successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while archiving notes" });
  }
});

//Route to unarchive note
router.post("/unarchive-note", async (req, res) => {
  let unArchived;
  const noteId = req.body._id;
  try {
    unArchived = new Note({
      _id: req.body._id,
      userId: req.body.userId, //This would be the users id
      username: req.body.username,
      title: req.body.title,
      note: req.body.note,
      picture: req.body.picture,
      video: req.body.video,
      canvas: req.body.canvas,
      bgImage: req.body.bgImage,
      bgColor: req.body.bgColor,
      remainder: req.body.remainder,
      collaborator: req.body.collaborator,
      label: req.body.label,
      location: req.body.location,
      createdAt: req.body.createdAt,
    });
    // console.log(archived);

    // Save to Archived
    await unArchived.save();

    // Remove from Note
    const existingNote = await Archived.findById(noteId);

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await Archived.findOneAndDelete({ _id: existingNote._id });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while archiving notes" });
  }
  if (!unArchived) {
    return res.status(404).json({ message: "Couldn't add to Archive" });
  }
  return res.status(200).json({ message: "Note unArchived successfully" });
});

//Route to get a single Archived Note
router.get("/get-archived/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id, "This is id");
  let archived;
  try {
    archived = await Archived.findById(id);
  } catch (err) {
    return res.status(404).json({ message: "Unable to find archived Notes" });
  }
  if (!archived) {
    return res.status(404).json({ message: "Can't get this Archive Notes" });
  }
  return res.status(200).json(archived);
});

//Remove a Pinined Note
router.delete("/remove-archived/:id", async (req, res) => {
  let noteId = req.params.id;
  let note;
  try {
    note = await Note.findOneAndRemove({ noteId: noteId });
  } catch (err) {
    console.log(err);
  }
  if (!note) {
    return res.status(404).json({ message: "Cannot remove Archived Note" });
  }
  return res
    .status(200)
    .json({ message: "Archived note removed successfully" });
});

//Route to get all a note
router.get("/getall-archived/:id", async (req, res) => {
  let userId = req.params.id;
  let archived;
  try {
    archived = await Archived.find({ userId: userId });
    if (!userId) {
      return res.status(404).json({ message: "Cannot get Archived Notes" });
    }
    return res.status(200).json(archived);
  } catch (error) {
    return res.status(404).json({ message: "Couldn't get Archived Notes" });
  }
});

router.post("/archived/set-bgcolor", async (req, res) => {
  const _id = req.body.id;

  try {
    const note = await Archived.findById(_id);

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

router.post("/archived/set-bgimage", async (req, res) => {
  const _id = req.body.id;

  try {
    const note = await Archived.findById(_id);

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
router.post("/archived/upload-picture", async (req, res) => {
  const _id = req.body.id;
  // console.log(_id);

  try {
    const note = await Archived.findById(_id);

    if (note) {
      note.picture = req.body.picture;
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
router.post("/archived/upload-video", async (req, res) => {
  const _id = req.body.id;
  // console.log(_id);

  try {
    const note = await Archived.findById(_id);

    if (note) {
      note.video = req.body.video;
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

module.exports = router; // Export the router instance

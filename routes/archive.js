const router = require("express").Router();
const Archived = require("../models/Archive");
const Note = require("../models/Note");
const Pinned = require("../models/Pinned");

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
      drawing: req.body.drawing,
      bgImage: req.body.bgImage,
      bgColor: req.body.bgColor,
      remainder: req.body.remainder,
      collaborator: req.body.collaborator,
      label: req.body.label,
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
      drawing: req.body.drawing,
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

router.get("/get-archived/:id", async (req, res) => {
  const userId = req.params.id;
  let archived;
  try {
    archived = await Archived.find({ userId: userId });
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

module.exports = router; // Export the router instance

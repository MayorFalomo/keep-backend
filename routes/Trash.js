const router = require("express").Router();
const Trash = require("../models/Trash");
const Note = require("../models/Note");
const Archive = require("../models/Archive");
const Pinned = require("../models/Pinned");

router.post("/trash-note", async (req, res) => {
  try {
    const trashNote = {
      _id: req.body._id,
      userId: req.body.userId,
      username: req.body.username,
      title: req.body.title,
      note: req.body.note,
      picture: req.body.picture,
      drawing: req.body.drawing,
      bgImage: req.body.bgImage,
      bgColor: req.body.bgColor,
      remainder: req.body.remainder,
      collaborator: req.body.collaborator,
      labels: req.body.labels,
      location: req.body.location,
      createdAt: req.body.createdAt,
    };

    // Save to Trash
    const trash = await Trash.create(trashNote);

    // Remove from Note after 1 day
    setTimeout(async () => {
      const existingNote = await Trash.findOneAndDelete({ _id: trashNote._id });

      if (!existingNote) {
        console.log("Note not found");
      }
    }, 24 * 60 * 60 * 1000); // 1 day in milliseconds

    if (!trash) {
      return res.status(404).json({ message: "Couldn't add to Archive" });
    }

    // Remove from Note
    const existingNote = await Note.findOneAndDelete({ _id: trashNote._id });
    const existingPinnedNote = await Pinned.findOneAndDelete({
      _id: trashNote._id,
    });

    if (!existingNote && !existingPinnedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.status(200).json({ message: "Note Archived successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while archiving notes" });
  }
});

//Restore a note in Trash to Note
router.post("/untrash-note", async (req, res) => {
  let unTrashed;
  const noteId = req.body._id;
  try {
    unTrashed = new Note({
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
      labels: req.body.labels,
      location: req.body.location,
      createdAt: req.body.createdAt,
    });

    // Create the Note
    const createInNote = await Note.create(unTrashed);
    //If note is not Created
    if (!createInNote) {
      return res.status(400).json({ error: "Error while restoring notes" });
    }

    // Remove from Note
    const existingNote = await Trash.findById(noteId);
    //If note is not found
    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await Trash.findOneAndDelete({ _id: unTrashed._id });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while UnTrashing notes" });
  }
  if (!unTrashed) {
    return res.status(404).json({ message: "Couldn't add to Note" });
  }
  return res.status(200).json({ message: "Note unTrashed successfully" });
});

//Get a users notes in Trash
router.get("/get-trash/:id", async (req, res) => {
  const userId = req.params.id;
  let trash;
  try {
    trash = await Trash.find({ userId: userId });
  } catch (err) {
    return res.status(404).json({ message: "Unable to find archived Notes" });
  }
  if (!trash) {
    return res.status(404).json({ message: "Can't get this Archive Notes" });
  }
  return res.status(200).json(trash);
});

//Trash a Note
router.delete("/remove-trash/:id", async (req, res) => {
  let noteId = req.params.id;
  let note;
  try {
    note = await Note.findOneAndDelete({ noteId: noteId });
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

//Create a note to Trash from Archived note
router.post("/to-trash-archived-note", async (req, res) => {
  try {
    const trashNote = {
      _id: req.body._id,
      userId: req.body.userId,
      username: req.body.username,
      title: req.body.title,
      note: req.body.note,
      picture: req.body.picture,
      drawing: req.body.drawing,
      bgImage: req.body.bgImage,
      bgColor: req.body.bgColor,
      remainder: req.body.remainder,
      collaborator: req.body.collaborator,
      labels: req.body.labels,
      location: req.body.location,
      createdAt: req.body.createdAt,
    };

    // Save to Trash
    const trash = await Trash.create(trashNote);
    // console.log(archived);

    setTimeout(() => {
      const deleteNote = Trash.findOneAndDelete({ _id: trashNote._id });
      if (!deleteNote) {
        return res.status(404).json({ message: "Couldn't add to Trash" });
      }
    }, 24 * 60 * 60 * 1000); // One day in Milliseconds

    if (!trash) {
      return res.status(404).json({ message: "Couldn't add to Archive" });
    }

    // Remove from Note
    const existingNote = await Archive.findOneAndDelete({ _id: trashNote._id });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.status(200).json({ message: "Note Archived successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while archiving notes" });
  }
});

//Restore a note in Trash to Archive
router.post("/to-archive-trashed-note", async (req, res) => {
  let unTrashed;
  const noteId = req.body._id;
  try {
    unTrashed = new Note({
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
      labels: req.body.labels,
      location: req.body.location,
      createdAt: req.body.createdAt,
    });
    // console.log(archived);

    // Save to Archived
    await Archive.save();

    // Remove from Note
    const existingNote = await Trash.findById(noteId);

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await Trash.findOneAndDelete({ _id: unTrashed._id });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Error while archiving notes" });
  }
  if (!unTrashed) {
    return res.status(404).json({ message: "Couldn't add to Archive" });
  }
  return res.status(200).json({ message: "Note unArchived successfully" });
});

module.exports = router; // Export the router instance

const router = require("express").Router();
const Label = require("../models/Label");

//Add labels
router.post("/add-label", async (req, res) => {
  const _id = req.body._id;
  const newLabel = req.body.label;
  try {
    const note = await Label.findById(_id);

    if (note) {
      // Check if the label already exists
      const existingLabel = note.label.find((label) => label == newLabel);

      //*check to check if the label already exists
      // if (existingLabel) {
      //   return res.status(400).json({ message: "Label already exists" });
      // }

      // Create a new label object with selected properties
      const newLabelObject = {
        name: newLabel,
        _id: note._id,
        userId: note.userId,
        username: note.username,
        title: note.title,
        note: note.note,
        picture: note.picture,
        bgColor: note.bgColor,
        bgImage: note.bgImage,
        drawing: note.drawing,
        location: note.location,
        label: newLabel,
        canvas: note.canvas,
        collaborator: note.collaborator,
        createdAt: note.createdAt,
        // Add any other properties you want to include
      };

      // Push the new label object to the labels array
      note.labels.push(newLabelObject);

      // Save the updated note
      await note.save();

      return res.status(200).json({
        message: "Label added successfully",
        // note,
      });
    } else {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router; // Export the router instance

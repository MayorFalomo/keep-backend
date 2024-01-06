const router = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/Users");
const Pinned = require("../models/Pinned");
// Creating a Note
router.post("/create-note", async (req, res) => {
  const newNote = new Note(req.body);
  try {
    const savedNote = await newNote.save();
    res.status(200).json(savedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update a note
router.put("/update-note/:id", async (req, res) => {
  //basically we're running an if check before updating the note, to check if it's the actual user
  if (req.body._id == req.params.id) {
    try {
      const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true } //When this line is added whatever you update shows immediately in postman
      );
      res.status(200).json(updatedNote);
      // console.log("Updated Note successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ message: "userId does not match" });
  }
});

//Route to get a single note
router.get("/get-note/:id", async (req, res) => {
  const id = req.params.id;
  let note;
  try {
    note = await Note.findOne({ _id: id });
  } catch (err) {
    return res.status(404).json({ message: "Unable to find Pinned Notes" });
  }
  if (!note) {
    return res.status(404).json({ message: "Can't get this Pinned Notes" });
  }
  return res.status(200).json(note);
});

//Send note to another user or  or collaborate with another user
router.post("/send-note", async (req, res) => {
  const {
    _id,
    userId,
    generatedId,
    username,
    collabUsername,
    email,
    title,
    note,
    picture,
    bgColor,
    bgImage,
    drawing,
    canvas,
    location,
    labels,
    collaborator,
    createdAt,
  } = req.body;

  try {
    const toUser = await User.findOne({
      username, // collabUsername is the username of the user we 're sending to and finding
    });

    await Note.findByIdAndUpdate(_id, {
      $push: { collaborator: collabUsername },
    });

    //Then i create & send the new note with the new collaborator
    const newNote = new Note({
      _id: generatedId, //generated Id so the note is new
      userId: toUser?._id, //The current user's Id
      username,
      email: toUser?.email,
      title,
      note,
      picture,
      bgColor,
      bgImage,
      drawing,
      location,
      labels,
      canvas,
      collaborator: collaborator,
      createdAt,
    });
    await newNote.save();

    res.json({ message: "Note sent successfully" });

    if (!toUser) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "wtf is Internal Error" });
  }
});

//Route to get all the note of a single user by userId
// router.get(`/:id`, async ( req, res ) => {
//   const userId = req.params.userId;
//   let notes;
//   try {
//     notes = await Note.find({ userId })
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   if (!notes) {
//     return res.status(404).json({ message: "No posts found" });
//   }

//   return res.status(200).json(notes);
// });

//get all notes for a singleUser by their userId
router.get(`/getall-notes/:userId`, async (req, res) => {
  //First i get the userId of the current user to call all the notes for that specific user
  const userId = req.params.userId;
  let notes;
  try {
    //This returns all the notes for that specific user
    notes = await Note.find({ userId }).sort({ createdAt: -1 });
    // console.log(notes, "All Notes");
    if (!notes) {
      return res.status(404).json({ message: "No notes found for this user" });
    }
    // const updatedNotes = await Promise.all(
    //   notes.map(async (note) => {
    //     //I assign the pinned note Id to the noteId variable
    //     const noteId = note._id;
    //     // console.log(noteId, "This is noteId");
    //     const currentPinnedNote = await Pinned.findOne({ _id: noteId });
    //     if (!currentPinnedNote) {
    //       return note;
    //     }
    //     // console.log(currentPinnedNote, "This is currentPinnedNote");
    //     // console.log(currentPinnedNote.bgImage, "This is bgImage");
    //     // console.log(note);
    //     note.note = currentPinnedNote.note;
    //     note.title = currentPinnedNote.title;
    //     note.picture = currentPinnedNote.picture
    //       ? currentPinnedNote.picture
    //       : note.picture;
    //     note.video = currentPinnedNote.video
    //       ? currentPinnedNote.video
    //       : note.video;
    //     note.bgColor = currentPinnedNote.bgColor
    //       ? currentPinnedNote.bgColor
    //       : note.bgColor;
    //     note.bgImage = currentPinnedNote.bgImage
    //       ? currentPinnedNote.bgImage
    //       : note.bgImage;
    //     // note.label = currentPinnedNote.label
    //     //   ? currentPinnedNote.label
    //     //   : note.label;
    //     note.location = currentPinnedNote.location
    //       ? currentPinnedNote.location
    //       : note.location;
    //     note.canvas = currentPinnedNote.canvas
    //       ? currentPinnedNote.canvas
    //       : note.canvas;
    //     // note.collaborator = currentPinnedNote.collaborator
    //     //   ? currentPinnedNote.collaborator
    //     //   : note.collaborator;
    //     const updatedNote = await note.save();
    //     // console.log(updatedNote);
    //     return updatedNote;
    //   })
    // );
    //Unnecessary but then i Filter out any null values
    // const filteredUpdatedPinnedNotes = updatedNotes.filter(
    //   (note) => note !== null
    // );
    return res.status(200).json(notes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to set a notification for later today
router.post("/set-notification/later-today", async (req, res) => {
  //get all this object from the req.body
  const {
    _id,
    userId,
    username,
    title,
    note,
    picture,
    bgColor,
    bgImage,
    drawing,
    location,
    label,
    canvas,
    collaborator,
    createdAt,
  } = req.body;

  try {
    // Calculating the time until 8 AM tomorrow
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(20, 0, 0, 0); // Set time to 8 AM tomorrow

    // If the current time is after 8 AM, schedule it for 8 AM tomorrow
    if (now > targetTime) {
      targetTime.setDate(now.getDate() + 1);
    }

    const timeUntil8AM = targetTime.getTime() - now.getTime();
    console.log(timeUntil8AM, "time until 8am");

    // The notification message
    const notificationMessage = "You have a new notification";

    // The notification object with the message and userDetails
    const notification = {
      message: notificationMessage,
      _id,
      userId,
      username,
      title,
      note,
      picture,
      bgColor,
      bgImage,
      location,
      drawing,
      label,
      canvas,
      collaborator,
      createdAt,
    };
    //setTimeOut to run the function at 8am
    setTimeout(async (req, res) => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );
        // console.log(user);
        console.log("Notification sent:", notification);
        if (!user) {
          return res.status(404).json({
            message: "Notification with the provided ID already exists",
          });
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }, timeUntil8AM);

    return res
      .status(200)
      .json({ message: "Notification scheduled successfully" });
  } catch (err) {
    console.error("Error scheduling notification:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to set notification for tomorrow
router.post("/set-notification/tomorrow", async (req, res) => {
  const {
    _id,
    userId,
    username,
    title,
    note,
    picture,
    video,
    bgColor,
    bgImage,
    location,
    drawing,
    label,
    canvas,
    collaborator,
    createdAt,
    remainder,
  } = req.body;

  try {
    // Calculating the time until 8 AM tomorrow
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(8, 0, 0, 0); // Set time to 8 AM tomorrow

    // If the current time is after 8 AM, schedule it for 8 AM tomorrow
    targetTime.setDate(now.getDate() + 1);

    const tomorrow = targetTime.getTime() - now.getTime();
    console.log(tomorrow, "this is tomorrow");

    // The notification message
    const notificationMessage = "You have a notification";

    // The notification object with the message and userDetails
    const notification = {
      message: notificationMessage,
      _id,
      userId,
      username,
      title,
      note,
      picture,
      video,
      bgColor,
      bgImage,
      drawing,
      location,
      label,
      remainder,
      canvas,
      collaborator,
      createdAt,
    };
    //setTimeOut to run the function at 8am
    setTimeout(async (req, res) => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );
        console.log(user, "new user");
        if (!user) {
          return res.status(404).json({
            message: "Notification with the provided ID already exists",
          });
        }
        console.log("Notification sent:", notification);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }, tomorrow);

    return res
      .status(200)
      .json({ message: "Notification scheduled successfully" });
  } catch (err) {
    console.error("Error scheduling notification:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to calculate time till next week Monday
router.post("/set-notification/next-week", async (req, res) => {
  const {
    _id,
    userId,
    username,
    title,
    note,
    picture,
    video,
    bgColor,
    bgImage,
    location,
    label,
    canvas,
    collaborator,
    createdAt,
  } = req.body;

  try {
    // Calculating the time until next monday tomorrow
    const now = new Date();
    const daysUntilNextMonday = ((1 - now.getDay() + 7) % 7) + 1;
    const targetTime = new Date(now);
    targetTime.setDate(now.getDate() + daysUntilNextMonday);
    targetTime.setHours(8, 0, 0, 0); // Set time to 8 AM next Monday

    const timeUntilNextMonday8AM = targetTime.getTime() - now.getTime();
    console.log(timeUntilNextMonday8AM);

    // The notification message
    const notificationMessage = "You have a notification";

    // The notification object with the message and userDetails
    const notification = {
      message: notificationMessage,
      _id,
      userId,
      username,
      title,
      note,
      picture,
      video,
      bgColor,
      bgImage,
      location,
      label,
      canvas,
      collaborator,
      createdAt,
    };
    //setTimeOut to run the function at 8am
    setTimeout(async (req, res) => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );
        // console.log(user);
        if (!user) {
          return res.status(404).json({
            message: "Notification with the provided ID already exists",
          });
        }

        console.log("Notification sent:", notification);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }, timeUntilNextMonday8AM);

    return res
      .status(200)
      .json({ message: "Notification scheduled successfully" });
  } catch (err) {
    console.error("Error scheduling notification:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to set notification for custom time
router.post("/set-notification/pick-a-time", async (req, res) => {
  const {
    _id,
    userId,
    username,
    title,
    note,
    picture,
    video,
    bgColor,
    bgImage,
    location,
    label,
    labelId,
    canvas,
    collaborator,
    createdAt,
    time,
  } = req.body;

  // Validate that time is provided
  if (!time) {
    return res.status(400).json({ message: "Time is required" });
  }

  try {
    // const time = new Date(time);

    // Parse the time value
    const scheduledTime = new Date(time); // Get the time value from req.body
    // console.log(scheduledTime, "This is scheduled time");

    const now = new Date();
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    console.log(timeUntilNotification, "Time until notification");

    // The notification message
    const notificationMessage = "You have a notification";

    // The notification object with the message and userDetails
    const notification = {
      message: notificationMessage,
      _id,
      userId,
      username,
      title,
      note,
      picture,
      video,
      bgColor,
      bgImage,
      location,
      label,
      labelId,
      canvas,
      collaborator,
      createdAt,
    };

    // Set the timeout to send the notification at the specified time
    setTimeout(async (req, res) => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );

        // console.log("Notification sent:", notification);
        if (!user) {
          return res.status(404).json({
            message: "Notification with the provided ID already exists",
          });
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }, timeUntilNotification);

    return res
      .status(200)
      .json({ message: "Notification scheduled successfully" });
  } catch (err) {
    console.error("Error scheduling notification:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to Add Country to a note
router.put("/add-country/:id", async (req, res) => {
  const noteId = req.params.id;
  const location = req.body.location;

  try {
    // Find the note by ID
    const note = await Note.findById(noteId);
    // console.log(note, "This is note");
    // If the note is found, update the location to an empty string
    if (note) {
      note.location = location;
      console.log(note.location, "location");
      await note.save();

      return res
        .status(200)
        .json({ message: "Location Updated successfully", note });
    } else {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to delete Country from the note
router.put("/delete-country/:id", async (req, res) => {
  const noteId = req.params.id;

  try {
    // Find the note by ID
    const note = await Note.findById(noteId);

    // If the note is found, update the location to an empty string
    if (note) {
      note.location = "";
      await note.save();

      return res
        .status(200)
        .json({ message: "Country deleted successfully", note });
    } else {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/set-bgcolor", async (req, res) => {
  const _id = req.body.id;

  try {
    const note = await Note.findById(_id);

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

router.post("/set-bgimage", async (req, res) => {
  const _id = req.body.id;

  try {
    const note = await Note.findById(_id);

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
router.post("/upload-picture", async (req, res) => {
  const _id = req.body.id;
  // console.log(_id);

  try {
    const note = await Note.findById(_id);

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
router.post("/upload-video", async (req, res) => {
  const _id = req.body.id;
  // console.log(_id);

  try {
    const note = await Note.findById(_id);

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

//Why can't you just create a new modal for label: problems: you won't be able to have a note with multiple labels since their id's would be the same when creating to avoid this i could probably assign a different _id to each label when creating a new label note but problem is i could potentially have multiple versions of the same note with the same label and i don't want that
//Add labels
router.post("/add-label", async (req, res) => {
  const _id = req.body._id;
  const labelId = req.body.labelId;
  const label = req.body.label;

  try {
    // Check if the label already exists in any notes
    const existingNotesWithLabel = await Note.find({ label: label });
    // console.log(existingNotesWithLabel, "existingNotesWithLabel");

    // Find the note based on the provided id
    const foundNote = await Note.findById(_id);

    if (existingNotesWithLabel.length > 0) {
      // If the label exists in multiple notes, set the label and labelId for each matching note
      for (const note of existingNotesWithLabel) {
        note.label = label;
        note.labelId = labelId;
        await note.save();
      }

      // Also, update the note with the provided _id
      foundNote.label = label;
      foundNote.labelId = labelId;
      await foundNote.save();

      return res.status(200).json({
        message: "Label added successfully to existing notes",
      });
    } else {
      // If the label doesn't exist in any notes, update the note based on the provided id
      foundNote.label = label;
      foundNote.labelId = labelId;

      // Save the updated note
      await foundNote.save();

      return res.status(200).json({
        message: "Label added for new notes",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//route to get label of a note
router.get("/get-label/:id", async (req, res) => {
  const labelId = req.params.id;
  let note;
  try {
    note = await Note.find({ labelId: labelId });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Route to delete label
router.post("/delete-label", async (req, res) => {
  const _id = req.body._id;
  const labelId = req.body.labelId;
  const label = req.body.label;
  try {
    const note = await Note.findById(_id);
    // console.log(note);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.label = label;
    note.labelId = labelId;
    await note.save();
    log;
    return res.status(200).json({ message: "Label deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Route to edit label
router.put("/edit-label", async (req, res) => {
  const _id = req.body._id;
  const label = req.body.label;
  const labelId = req.body.labelId;
  try {
    const note = await Note.findById(_id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.label = label;
    note.labelId = labelId;
    await note.save();
    console.log(note);
    return res.status(200).json({ message: "label successfully edited " });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//Route to save canvas
router.post("/save-canvas", async (req, res) => {
  const _id = req.body.id;
  const canvas = req.body.canvas;
  try {
    // console.log(_id, "This is id");
    const note = await Note.findById(_id);
    // console.log(note);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.canvas.push(canvas);
    await note.save();

    return res.status(200).json({ message: "Canvas saved successfully" });
  } catch (err) {
    console.error(err);
  }
});

//delete canvas
router.post("/delete-canvas", async (req, res) => {
  const _id = req.body.id;
  // console.log(_id, "This is id");
  try {
    const note = await Note.findById(_id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    console.log(note);
    note.canvas = [];
    await note.save();
    console.log(note);
    return res.status(200).json({ message: "Canvas deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/create-note-with-picture", async (req, res) => {
  const id = req.body.id;

  const newNoteObject = {
    // name: newLabel,
    _id: id,
    userId: req.body.userId,
    title: req.body.title,
    note: req.body.note,
    picture: req.body.picture,
    bgColor: req.body.bgColor,
    bgImage: req.body.bgImage,
    video: req.body.video,
    location: req.body.location,
    label: req.body.label,
    labelId: req.body.labelId,
    canvas: req.body.canvas,
    collaborator: req.body.collaborator,
    createdAt: req.body.createdAt,
  };
  // console.log(newNoteObject);

  try {
    await Note.create(newNoteObject);
    // newNote.save();
    return res
      .status(200)
      .json({ message: "Note created with picture successfully " });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/create-note-with-canvas", async (req, res) => {
  const id = req.body._id;

  const newNoteObject = {
    // name: newLabel,
    _id: id,
    userId: req.body.userId,
    title: req.body.title,
    note: req.body.note,
    picture: req.body.picture,
    bgColor: req.body.bgColor,
    bgImage: req.body.bgImage,
    video: req.body.video,
    drawing: req.body.drawing,
    location: req.body.location,
    label: req.body.label,
    labelId: req.body.labelId,
    canvas: req.body.canvas,
    collaborator: req.body.collaborator,
    createdAt: req.body.createdAt,
  };
  // console.log(newNoteObject);

  try {
    await Note.create(newNoteObject);
    // newNote.save();
    return res
      .status(200)
      .json({ message: "Note created with canvas successfully " });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//Route to save canvas
// router.post("/create-note-with-canvas", async (req, res) => {
//   const newNote = new Note(req.body);
//   try {
//     const savedNote = await newNote.save();
//     console.log(savedNote, "Saved Note");
//     res.status(200).json(savedNote);

//     return res.status(200).json({ message: "Canvas note saved successfully" });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// Update all documents to include the new field
// Note.updateMany({}, { $set: { label: "" } })
//   .then((result) => {
//     console.log("Documents updated successfully:", result);
//   })
//   .catch((err) => {
//     console.error("Error updating documents:", err);
//   });

module.exports = router; // Export the router instance

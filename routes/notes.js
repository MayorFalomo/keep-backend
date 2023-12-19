const router = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/Users");

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
  const userId = req.params.userId;
  let notes;
  try {
    notes = await Note.find({ userId }).sort({ createdAt: -1 });
  } catch (err) {
    res.status(500).json(err);
  }

  if (!notes) {
    return res.status(404).json({ message: "No posts found" });
  }

  return res.status(200).json({ notes });
});

//Route to set a notification for later today
router.post("/set-notification/later-today", async (req, res) => {
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
    labels,
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
    console.log(timeUntil8AM);

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
      bgColor,
      bgImage,
      location,
      drawing,
      labels,
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
    bgColor,
    bgImage,
    location,
    drawing,
    labels,
    collaborator,
    createdAt,
  } = req.body;

  try {
    // Calculating the time until 8 AM tomorrow
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(8, 0, 0, 0); // Set time to 8 AM tomorrow

    // If the current time is after 8 AM, schedule it for 8 AM tomorrow
    if (now > targetTime) {
      targetTime.setDate(now.getDate() + 1);
    }

    const timeUntil8AM = targetTime.getTime() - now.getTime();
    console.log(timeUntil8AM);

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
      bgColor,
      bgImage,
      drawing,
      location,
      labels,
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
    }, timeUntil8AM);

    return res
      .status(200)
      .json({ message: "Notification scheduled successfully" });
  } catch (err) {
    console.error("Error scheduling notification:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/set-notification/next-week", async (req, res) => {
  const {
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
    labels,
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
      bgColor,
      bgImage,
      drawing,
      location,
      labels,
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

router.post("/set-notification/pick-a-time", async (req, res) => {
  const {
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
    labels,
    collaborator,
    createdAt,
  } = req.body;

  try {
    const time = new Date(req.body.time); // Get the time value from req.body

    // console.log(time, "This is time");

    const now = new Date();
    const timeUntilNotification = time.getTime() - now.getTime();
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
      bgColor,
      bgImage,
      drawing,
      location,
      labels,
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

        console.log("Notification sent:", notification);
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

//Add labels
router.post("/add-label", async (req, res) => {
  const _id = req.body._id;
  const newLabel = req.body.label;
  try {
    const note = await Note.findById(_id);

    if (note) {
      // Check if the label already exists
      const existingLabel = note.labels.find((label) => label == newLabel);

      if (existingLabel) {
        return res.status(400).json({ message: "Label already exists" });
      }

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

router.post("/save-canvas", async (req, res) => {
  const _id = req.body._id;
  const canvas = req.body.canvas;

  try {
    const note = await Note.findById(_id);

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
// Update all documents to include the new field
// Note.updateMany({}, { $set: { canvas: [] } })
//   .then((result) => {
//     console.log("Documents updated successfully:", result);
//   })
//   .catch((err) => {
//     console.error("Error updating documents:", err);
//   });

module.exports = router; // Export the router instance

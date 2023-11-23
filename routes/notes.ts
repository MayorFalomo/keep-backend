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
router.put("/update-note/:id", async (req: any, res: any) => {
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
router.get('/get-note/:id', async (req: any, res: any) => {
    const id = req.params.id;
    let note;
    try {
        note = await Note.findOne({ _id: id });
    } catch (err) {
        return res.status(404).json({ message: "Unable to find Pinned Notes" })
    }
    if (!note) {
        return res.status(404).json({ message: "Can't get this Pinned Notes" })
    }
    return res.status(200).json(note)
});

// Search for users by their username
router.get('/search', async (req:any, res:any) => {
  const { username } = req.query;

  try {
    const users = await User.findOne({ username: { $regex: new RegExp(username, 'i') } });
    console.log(users, "This is users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/send-note', async (req:any, res:any) => {
  const {  _id, userId, generatedId, username, toUsername, title, note, picture, bgColor, bgImage, drawing, location, label, collaborator, createdAt } = req.body;

  try {
    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the note with the specified _id exists
    const existingNote = await Note.findById(_id);
    if (existingNote) {
      //Then i Update the collaborator field for the existing note
      await Note.findByIdAndUpdate(_id, { collaborator: toUsername });
    } else {
      return res.status(404).json({ error: 'Note not found' });
    }
//Then i create & send the new note with the new collaborator
    const newNote = new Note({
      _id : generatedId ,
      userId: toUser?._id ,
      username: toUser?.username ,
      toUsername,
      title,
      note,
      picture,
      bgColor,
      bgImage,
      drawing,
      location,
      label,
      collaborator: username ,
      createdAt: new Date(),
    });
    await newNote.save();

    res.json({ message: 'Note sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Route to get all the note of a single user by userId
// router.get(`/:id`, async (req:any, res:any) => {
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
router.get(`/getall-notes/:userId`, async (req:any, res:any) => {
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


router.post('/set-notification/later-today', async (req:any, res:any) => {
  const { _id, userId, username, title, note, picture, bgColor, bgImage, drawing, location, label, collaborator, createdAt } = req.body;

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
    const notificationMessage = 'You have a notification';

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
      collaborator,
      createdAt,
    };
    //setTimeOut to run the function at 8am
    setTimeout(async () => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );
        // console.log(user);
        console.log('Notification sent:', notification);
         if (!user) {
      return res.status(404).json({ message: "Notification with the provided ID already exists" });
    }
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }, timeUntil8AM);

    return res.status(200).json({ message: 'Notification scheduled successfully' });

  } catch (err) {
    console.error('Error scheduling notification:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/set-notification/tomorrow', async (req:any, res:any) => {
  const { _id, userId, username, title, note, picture, bgColor, bgImage, location, drawing, label, collaborator, createdAt } = req.body;

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
    const notificationMessage = 'You have a notification';

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
      label,
      collaborator,
      createdAt,
    };
    //setTimeOut to run the function at 8am
    setTimeout(async () => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );
        // console.log(user);
        

        console.log('Notification sent:', notification);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }, timeUntil8AM);

    return res.status(200).json({ message: 'Notification scheduled successfully' });

  } catch (err) {
    console.error('Error scheduling notification:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/set-notification/next-week', async (req:any, res:any) => {
  const { _id, userId, username, title, note, picture, bgColor, bgImage,location, drawing, label, collaborator, createdAt } = req.body;

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
    const notificationMessage = 'You have a notification';

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
      label,
      collaborator,
      createdAt,
    };
    //setTimeOut to run the function at 8am
    setTimeout(async () => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );
        // console.log(user);
        

        console.log('Notification sent:', notification);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }, timeUntilNextMonday8AM);

    return res.status(200).json({ message: 'Notification scheduled successfully' });

  } catch (err) {
    console.error('Error scheduling notification:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/set-notification/pick-a-time', async (req: any, res: any) => {
  const { _id, userId, username, title, note, picture, bgColor, bgImage, location, drawing, label, collaborator, createdAt } = req.body;

  try {
    const time = new Date(req.body.time); // Get the time value from req.body

    // console.log(time, "This is time");
    
    const now = new Date();
    const timeUntilNotification = time.getTime() - now.getTime();
console.log(timeUntilNotification, "Time until notification");

    // The notification message
    const notificationMessage = 'You have a notification';

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
      label,
      collaborator,
      createdAt,
    };

    // Set the timeout to send the notification at the specified time
    setTimeout(async () => {
      try {
        // Find the user and push the notification object into their notifications array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { notifications: notification } },
          { new: true } // To get the updated user document
        );

        console.log('Notification sent:', notification);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }, timeUntilNotification);

    return res.status(200).json({ message: 'Notification scheduled successfully' });
  } catch (err) {
    console.error('Error scheduling notification:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Route to delete Country from the note
router.put('/delete-country/:id', async (req:any, res:any) => {
  const noteId = req.params.id;

  try {
    // Find the note by ID
    const note = await Note.findById(noteId);

    // If the note is found, update the location to an empty string
    if (note) {
      note.location = '';
      await note.save();

      return res.status(200).json({ message: 'Country deleted successfully', note });
    } else {
      return res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router; // Export the router instance

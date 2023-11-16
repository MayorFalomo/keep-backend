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
  // console.log(req.body._id, "This is _Id");
  // console.log( req.params.id, "This is Req and params ");
  if (req.body._id == req.params.id) {
        try {            
            const updatedNote = await Note.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true } //When this line is added whatever you update shows immediately in postman
            );
          res.status(200).json(updatedNote);
          console.log("Updated Note successfully");
          
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

//Route to get all the note of a single user by userId
router.get(`/:id`, async (req:any, res:any) => {
  const userId = req.params.userId;
  let notes;
  try {
    notes = await Note.find({ userId })
  } catch (err) {
    res.status(500).json(err);
  }

  if (!notes) {
    return res.status(404).json({ message: "No posts found" });
  }

  return res.status(200).json({ notes });
});


//get all notes for a singleUser by their userId
router.get(`/getall-notes/:id`, async (req:any, res:any) => {
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

router.post("/set-notification", async (req:any, res:any) => {
  // const postId = req.body._id;
  let remainder;
  let user;

  const noteDetails = {
    _id: req.body._id,
    userId: req.body.userId,//This is the important bit
    username: req.body.username, 
    title: req.body.title,
    note: req.body.note,
    picture: req.body.picture,
    bgColor: req.body.bgColor,
    bgImage: req.body.bgImage,
    drawing: req.body.drawing,
    label: req.body.label,
    collaborator: req.body.collaborator,
    createdAt: req.body.createdAt, // Add the createdAt timestamp
  };
  try {
    remainder = await User.findByIdAndUpdate(
      {
        userId: req.body.userId,
      },
      {
        $push: { notification: noteDetails },
      }
    );
    // The notification message
    const notificationMessage = "You have notification";
    // The notification object with the message and userDetails
    const notification = {
      message: notificationMessage,
      ...noteDetails,
    };
    // Find the user whose post was liked and push the notification object into their notifications array
    user = await User.findOneAndUpdate(
      { userId: noteDetails.userId },
      { $push: { notifications: notification } }
    );
  } catch (err) {
    console.log(err);
  }
  if (!remainder) {
    return res.status(404).json({ message: "Can't set Remainder" });
  }
  console.log(remainder);
  return res.status(200).json({ message: "Successfully set Remainder" });
});


module.exports = router; // Export the router instance

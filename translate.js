const Note = require("./models/Note");
const dotEnv = require("dotenv");

dotEnv.config({ path: "./vars/.env" });

const router = require("express").Router();

const { Translate } = require("@google-cloud/translate").v2;

const translationApi = new Translate({
  projectId: "118164317804619501465",
  key: "AIzaSyD46Q1ZkncT2EV0ot3phnecttkQwgo1kKM",
});

//Function to translate note
const translateText = async (text, targetLanguage) => {
  try {
    const [response] = await translationApi.translate(text, targetLanguage);
    // console.log(response, "response");
    return response;
  } catch (err) {
    console.log(err);
  }
};

//Route to translate a note
router.post("/translate", async (req, res) => {
  const { noteObject } = req.body;

  try {
    //I first find the note by it's id
    const foundNote = await Note.findById({ _id: noteObject?._id });
    if (!foundNote) {
      return res.status(404).json({ message: "note not found" });
    }
    //Next i translate the note i found here
    const translatedNote = await translateText(
      foundNote.note,
      noteObject.targetLanguage
    );
    //Then i update the foundNote with my translatedNote and save it
    foundNote.note = translatedNote;
    await foundNote.save();
    return res.status(200).json({ foundNote });
  } catch (error) {
    console.log(error);
  }
});

//Route to get all Languages
router.get("/getall-languages", async (req, res) => {
  try {
    const [languages] = await translationApi.getLanguages();
    const languageInfo = languages.map(({ name, code }) => ({ name, code }));
    return res.status(200).json({ languages: languageInfo });
  } catch (error) {
    return res.status(404).json({ message: "languages not found" });
  }
});

module.exports = router;

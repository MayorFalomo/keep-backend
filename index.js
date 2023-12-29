const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const noteRoutes = require("./routes/notes");
const pinnedRoutes = require("./routes/pinned");
const archivedRoutes = require("./routes/archive");
const trashRoutes = require("./routes/Trash");
// const labelRoutes = require("./routes/label");
const userRoutes = require("./routes/users");

dotEnv.config({ path: "./vars/.env" });
app.use(express.json());
app.use(cors());
//to solve payload too large error for canvas
// app.use(bodyParser());
// app.use(bodyParser({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb" }));
//PayloadTooLargeError: request entity too large at readStream
mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to mongoDB"))
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/api/notes", noteRoutes);
app.use("/api/notes", pinnedRoutes);
app.use("/api/notes", archivedRoutes);
app.use("/api/notes", trashRoutes);
// app.use("/api/notes", labelRoutes);
app.use("/api/users", userRoutes);

app.listen("5000", () => {
  console.log("Server is running on port 5000");
  console.log(process.env.MONGO_URL);
});

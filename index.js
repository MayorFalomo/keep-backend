const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/notes");
const pinnedRoutes = require("./routes/pinned");
const archivedRoutes = require("./routes/archive");
const userRoutes = require("./routes/users");

dotEnv.config({ path: "./vars/.env" });
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to mongoDB"))
  .catch((err) => {
    console.log(err);
  });

app.get("/", () => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/api/notes", noteRoutes);
app.use("/api/notes", pinnedRoutes);
app.use("/api/notes", archivedRoutes);
app.use("/api/users", userRoutes);

app.listen("5000", () => {
  console.log("Server is running on port 5000");
  console.log(process.env.MONGODB_URL);
});

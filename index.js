const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

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

app.listen("5000", () => {
  console.log("Server is running on port 5000");
  console.log(process.env.MONGODB_URL);
});

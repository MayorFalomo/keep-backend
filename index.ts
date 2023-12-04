import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
const noteRoutes = require('./routes/notes')
const pinnedRoutes = require('./routes/pinned')
const archivedRoutes = require('./routes/archive')
const userRoutes = require('./routes/users')

// For the .env file
dotenv.config({ path: './vars/.env' });

const app: Application = express();
const port = process.env.PORT || 5000;
app.use(express.json());
const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

mongoose
  .connect('mongodb+srv://KaladinReborn:mayowa@cluster0.g848ftj.mongodb.net/keep?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/notes", noteRoutes)
  app.use("/api/notes", pinnedRoutes)
  app.use("/api/notes", archivedRoutes)
  app.use("/api/users", userRoutes)

app.listen(port, () => {
  console.log(`Server is firing at http://localhost:${port}`);
  // console.log(process.env.MONGODB_URL);
  
});

// const express = require("express");
// const app = express();
// const dotEnv = require("dotenv");
// const mongoose = require("mongoose");
// const cors = require("cors");

// dotEnv.config({ path: "./vars/.env" });
// app.use(express.json());
// app.use(cors());

// mongoose
//   .connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(console.log("Connected to mongoDB"))
//   .catch((err) => {
//     console.log(err);
//   });

// app.listen("5000", () => {
//   console.log("Server is running on port 5000");
//   console.log(process.env.MONGODB_URL);
// });

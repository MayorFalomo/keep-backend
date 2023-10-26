"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const noteRoutes = require('./routes/notes');
// For the .env file
dotenv_1.default.config({ path: './vars/.env' });
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Welcome to Express & TypeScript Server');
});
mongoose_1.default
    .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err) => {
    console.log(err);
});
app.use("/api/notes", noteRoutes);
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

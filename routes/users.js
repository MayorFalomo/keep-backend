"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const User = require("../models/Users");
// const Note = require("../models/Post");
//register a new user
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Since we imported User from our User schema component here is where we expect our information to be created for new user hence for example username: request.body(A method).username and so forth
        //This is the object we're directly pushing to mongoDb, we get the request from the frontEnd
        const newUser = new User({
            _id: req.body.id,
            userId: req.body.userId,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePic: req.body.profilePic,
            notifications: req.body.notifications
        });
        // console.log(newUser);
        //Here we assign the newly created user to the user variable and save() which is a mongoose method), Then we say the res.user should come in json file
        const user = yield newUser.save();
        // console.log(user, "I am user")
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//Route for login
router.post("/login/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    let user;
    try {
        user = yield User.findById(userId);
        // console.log(user);
    }
    catch (error) {
        return res.status(404).json({ message: "Something went wrong." });
    }
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ user });
}));
//Get a user
router.get("/get-user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.params.id);
        const _a = user._doc, { password } = _a, others = __rest(_a, ["password"]);
        res.status(200).json(others);
        //This way hides password
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//Get a user
router.get("/get-user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = await User.findById(req.params.userId)
        const userId = req.params.id; // Get the userId from the URL parameters
        const user = yield User.findOne({ userId: userId }); // Use findOne to find the user by the userId field
        const _b = user._doc, { password } = _b, others = __rest(_b, ["password"]);
        res.status(200).json(others);
        //This way hides password
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// Search for users by their username
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.query;
    try {
        const users = yield User.findOne({ username: { $regex: new RegExp(username, 'i') } });
        return res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
//Update a users info
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.userId == req.params.id) {
        try {
            const updatedNote = yield User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true } //When this line is added whatever you update shows immediately in postman
            );
            res.status(200).json(updatedNote);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(400).json({ message: "userId does not match" });
    }
}));
module.exports = router;

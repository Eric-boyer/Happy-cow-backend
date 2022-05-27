const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBased64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  const { username, email, password } = req.fields;
  try {
    if (email && password && username) {
      const emailExistng = await User.findOne({ email: email });
      // console.log(emailExistng);
      const usernameExistng = await User.findOne({ username: username });
      if (!usernameExistng) {
        if (!emailExistng) {
          const token = uid2(16);
          const salt = uid2(16);
          const hash = SHA256(password + salt).toString(encBased64);
          const newUser = new User({
            email,
            username,
            token,
            salt,
            hash,
          });
          await newUser.save();
          res.json({
            _id: newUser._id,
            email: email,
            username: username,
            token: token,
          });
        } else {
          res
            .status(400)
            .json({ message: "Oups !!! ce mail est déja utilisé" });
        }
      } else {
        res
          .status(400)
          .json({ message: "Oups !!! ce username est déja utilisé" });
      }
    } else {
      res.status(400).json({ message: "missing parameters" });
    }
    console.log("je suis present");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.fields;

    const user = await User.findOne({ email: email });

    console.log(user);

    if (user) {
      const testHash = SHA256(password + user.salt).toString(encBased64);
      if (testHash === user.hash) {
        res
          .status(200)
          .json({ _id: user._id, token: user.token, username: user.username });
      } else {
        res.status(400).json({ message: "unauthorized" });
      }
    } else {
      res.status(400).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;

const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const UserModel = require("../models/UserModel");

module.exports = async (req, res) => {
  const userId = uuid.v4();
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    res.status(400).send("Empty username");
    return;
  }

  if (!password) {
    res.status(400).send("Empty password");
    return;
  }

  if (username.length > 50) {
    res.status(400).send("Too long username");
    return;
  }

  if (password.length > 50) {
    res.status(400).send("Too long password");
    return;
  }

  if (username.length < 5) {
    res.status(400).send("Minimum 5 characters in username");
    return;
  }
  if (password.length < 5) {
    res.status(400).send("Minimum 5 characters in password");
    return;
  }

  const illegalRegexExp = /.*[!,%&*].*/;
  if (illegalRegexExp.test(username)) {
    res.status(400).send("Illegal characters is username");
    return;
  }
  if (illegalRegexExp.test(password)) {
    res.status(400).send("Illegal characters is password");
    return;
  }

  const user = new UserModel({
    userId,
    username,
    password,
  });
  const newUser = await user.save();
  console.log("Created: " + newUser);
  res.status(201).send("Created!");
};

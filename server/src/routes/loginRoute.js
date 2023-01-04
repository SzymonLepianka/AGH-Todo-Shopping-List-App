const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

module.exports = async (req, res) => {
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

  const userRes = await UserModel.find({ username, password });

  if (userRes.length === 0) {
    res.status(401).send("User doesn't exist!");
  } else {
    const userId = userRes[0].userId;
    const token = jwt.sign(
      {
        userId,
      },
      process.env.SECRET
    );
    res.json({
      token,
    });
  }
};

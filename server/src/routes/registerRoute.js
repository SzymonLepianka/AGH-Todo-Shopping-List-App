const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const UserModel = require('../models/UserModel');

module.exports = async (req, res) => {
    const userId = uuid.v4();
    const username = req.body.username;
    const password = req.body.password;

    const user = new UserModel({
        userId,
        username,
        password
    })
    const newUser = await user.save();
    console.log("Created: " + newUser);
    res.status(201).send('Created!');

}
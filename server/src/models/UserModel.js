const mongoose = require('mongoose'); 

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
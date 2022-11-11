const mongoose = require('mongoose'); 

const TodoSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    amount: {
        type: String,
    },
    grammage: {
        type: String,
    },
    completed: {
        type: Boolean,
    }
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;
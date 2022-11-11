const TodoModel = require('../models/TodoModel');

module.exports = async (req, res) => {
    const { id } = req.params;
    const todo = await TodoModel.findById(id);
    todo.completed = req.body.completed;
    todo.name = req.body.name;
    await todo.save();
    res.json(todo);
}
const TodoModel = require('../models/TodoModel');

module.exports = async (req, res) => {
    const { shoppingListId } = req.params;
    const todos = await TodoModel.find({ shoppingListId });
    res.json(todos);
}
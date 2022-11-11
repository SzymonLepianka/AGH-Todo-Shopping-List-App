const TodoModel = require('../models/TodoModel');

module.exports = async (req, res) => {
    const { name } = req.body;
    const { amount } = req.body;
    const { grammage } = req.body;
    const { shoppingListId } = req.body;
    const todo = new TodoModel({
        name,
        amount,
        grammage,
        completed: false,
        shoppingListId
    })
    const newTodo = await todo.save();
    res.json(newTodo);
};

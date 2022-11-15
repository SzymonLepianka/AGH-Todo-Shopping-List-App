const TodoModel = require('../models/TodoModel');
const ShoppingListModel = require('../models/ShoppingListModel');
const { getUserIdFromJwt } = require('../middleware/getUserIdFromJwt');

module.exports = async (req, res) => {
    const { name } = req.body;
    const { amount } = req.body;
    const { grammage } = req.body;
    const { shoppingListId } = req.body;

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    // check if shoppingList belongs to this user
    const shoppingList = await ShoppingListModel.find({ shoppingListId });
    if (shoppingList[0].userId !== userId) {
        res.status(401).send('Shopping list doesn\'t belongs to this user');
        return;
    }

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

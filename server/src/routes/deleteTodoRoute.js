const TodoModel = require('../models/TodoModel');
const ShoppingListModel = require('../models/ShoppingListModel');
const { getUserIdFromJwt } = require('../middleware/getUserIdFromJwt');

module.exports = async (req, res) => {
    const { id } = req.params;
    const todo = await TodoModel.findById(id);

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    // check if shoppingList belongs to this user
    const shoppingList = await ShoppingListModel.find({ shoppingListId: todo.shoppingListId });
    if (shoppingList[0].userId !== userId) {
        res.status(401).send('Shopping list doesn\'t belongs to this user');
        return;
    }

    await todo.remove();
    res.status(204).json(todo);
}
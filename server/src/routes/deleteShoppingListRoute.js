const ShoppingListModel = require('../models/ShoppingListModel');
const TodoModel = require('../models/TodoModel');

module.exports = async (req, res) => {
    const { id } = req.params;
    const shoppingList = await ShoppingListModel.findById(id);
    const shoppingListTodos = await TodoModel.find({shoppingListId: shoppingList.shoppingListId});
    await shoppingList.remove();
    shoppingListTodos.map(async (todo) => {
        await todo.remove();
    });
    res.status(204).json(shoppingList);
}
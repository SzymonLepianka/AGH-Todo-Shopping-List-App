const ShoppingListModel = require('../models/ShoppingListModel');

module.exports = async (req, res) => {
    const { id } = req.params;
    const shoppingList = await ShoppingListModel.findById(id);
    shoppingList.completed = req.body.completed;
    shoppingList.name = req.body.name;
    await shoppingList.save();
    res.json(shoppingList);
} 
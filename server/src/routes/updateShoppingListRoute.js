const ShoppingListModel = require('../models/ShoppingListModel');

module.exports = async (req, res) => {
    const { id } = req.params;
    const shoppingList = await ShoppingListModel.findById(id);
    shoppingList.completed = req.body.completed;
    shoppingList.text = req.body.text;
    await shoppingList.save();
    res.json(shoppingList);
} 
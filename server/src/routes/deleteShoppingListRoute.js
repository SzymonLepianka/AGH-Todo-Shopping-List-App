const ShoppingListModel = require('../models/ShoppingListModel');

module.exports = async (req, res) => {
    const { id } = req.params;
    const shoppingList = await ShoppingListModel.findById(id);
    await shoppingList.remove();
    res.status(204).json(shoppingList);
}
const ShoppingListModel = require('../models/ShoppingListModel');

module.exports = async (req, res) => {
    const shoppingLists = await ShoppingListModel.find();
    res.json(shoppingLists);
}
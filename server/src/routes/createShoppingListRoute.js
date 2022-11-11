const ShoppingListModel = require('../models/ShoppingListModel');
const uuid = require('uuid');

module.exports = async (req, res) => {
    const shoppingListId = uuid.v4();
    const { name } = req.body;
    const { date } = req.body;
    const shoppingList = new ShoppingListModel({
        shoppingListId,
        name,
        date,
        completed: false,
    })
    const newShoppingList = await shoppingList.save();
    res.json(newShoppingList);
};

const ShoppingListModel = require('../models/ShoppingListModel');

module.exports = async (req, res) => {
    const { text } = req.body;
    const { date } = req.body;
    const shoppingList = new ShoppingListModel({
        text,
        date,
        completed: false,
    })
    const newShoppingList = await shoppingList.save();
    res.json(newShoppingList);
};

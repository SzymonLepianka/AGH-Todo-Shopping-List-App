const ShoppingListModel = require('../models/ShoppingListModel');
const uuid = require('uuid');
const { getUserIdFromJwt } = require('../middleware/getUserIdFromJwt');

module.exports = async (req, res) => {

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    const shoppingListId = uuid.v4();
    const { name } = req.body;
    const { date } = req.body;
    const shoppingList = new ShoppingListModel({
        shoppingListId,
        name,
        date,
        completed: false,
        userId
    })
    const newShoppingList = await shoppingList.save();
    res.json(newShoppingList);
};

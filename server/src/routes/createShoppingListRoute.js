const ShoppingListModel = require('../models/ShoppingListModel');
const uuid = require('uuid');
const { getUserIdFromJwt } = require('../middleware/getUserIdFromJwt');

module.exports = async (req, res) => {

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    const shoppingListId = uuid.v4();
    const { name } = req.body;
    const { date } = req.body;
    if (!name) {
        res.status(400).send("Missing name param");
        return;
    }
    if (!date) {
        res.status(400).send("Missing date param");
        return;
    }
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

const { getUserIdFromJwt } = require('../middleware/getUserIdFromJwt');
const ShoppingListModel = require('../models/ShoppingListModel');

module.exports = async (req, res) => {

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    const shoppingLists = await ShoppingListModel.find({ userId });
    res.json(shoppingLists);
}
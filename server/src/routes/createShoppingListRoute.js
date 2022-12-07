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

    if (!dateIsValid(date)) {
        res.status(400).send("Bad date format (expected YYYY-MM-DD)");
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

function dateIsValid(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateStr);
}

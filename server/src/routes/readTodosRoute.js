const { getUserIdFromJwt } = require("../middleware/getUserIdFromJwt");
const ShoppingListModel = require("../models/ShoppingListModel");
const TodoModel = require("../models/TodoModel");

module.exports = async (req, res) => {
  const { shoppingListId } = req.params;

  // getting userId from JWT
  const userId = getUserIdFromJwt(req);

  // check if shoppingList belongs to this user
  const shoppingList = await ShoppingListModel.find({ shoppingListId });

  if (shoppingList.length === 0) {
    res.status(400).send("Shopping list doesn't exist");
    return;
  }

  if (shoppingList[0].userId !== userId) {
    res.status(401).send("Shopping list doesn't belong to this user");
    return;
  }

  const todos = await TodoModel.find({ shoppingListId });
  res.json(todos);
};

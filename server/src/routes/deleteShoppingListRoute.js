const ShoppingListModel = require("../models/ShoppingListModel");
const TodoModel = require("../models/TodoModel");
const { getUserIdFromJwt } = require("../middleware/getUserIdFromJwt");

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    const shoppingList = await ShoppingListModel.findById(id);

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    // check if shoppingList belongs to this user
    if (shoppingList.userId !== userId) {
      res.status(401).send("Shopping list doesn't belong to this user");
      return;
    }

    const shoppingListTodos = await TodoModel.find({
      shoppingListId: shoppingList.shoppingListId,
    });
    await shoppingList.remove();
    shoppingListTodos.map(async (todo) => {
      await todo.remove();
    });
    res.json(shoppingList);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
};

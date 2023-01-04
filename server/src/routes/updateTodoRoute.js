const TodoModel = require("../models/TodoModel");
const ShoppingListModel = require("../models/ShoppingListModel");
const { getUserIdFromJwt } = require("../middleware/getUserIdFromJwt");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await TodoModel.findById(id);

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    // check if todo exists
    if (!todo) {
      res.status(400).send("Todo doesn't exist");
      return;
    }

    // check if shoppingList belongs to this user
    const shoppingList = await ShoppingListModel.find({
      shoppingListId: todo.shoppingListId,
    });
    if (shoppingList[0].userId !== userId) {
      res.status(401).send("Shopping list doesn't belong to this user");
      return;
    }

    todo.completed = req.body.completed;
    todo.name = req.body.name;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
};

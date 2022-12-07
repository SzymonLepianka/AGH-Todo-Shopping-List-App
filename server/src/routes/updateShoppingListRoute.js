const { getUserIdFromJwt } = require("../middleware/getUserIdFromJwt");
const ShoppingListModel = require("../models/ShoppingListModel");

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    const shoppingList = await ShoppingListModel.findById(id);

    // getting userId from JWT
    const userId = getUserIdFromJwt(req);

    // check if shoppingList belongs to this user
    if (shoppingList.userId !== userId) {
      res.status(401).send("Shopping list doesn't belongs to this user");
      return;
    }

    shoppingList.completed = req.body.completed;
    shoppingList.name = req.body.name;
    await shoppingList.save();
    res.json(shoppingList);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
};

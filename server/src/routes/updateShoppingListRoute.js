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
      res.status(401).send("Shopping list doesn't belong to this user");
      return;
    }

    shoppingList.completed = req.body.completed;
    shoppingList.name = req.body.name;

    if (!req.body.name) {
      res.status(400).send("Missing name param");
      return;
    }
    if (req.body.name.length > 50) {
      res.status(400).send("Too long name param");
      return;
    }

    if (req.body.name.length < 4) {
      res.status(400).send("Too short name param");
      return;
    }
    const illegalRegexExp = /.*[!,%&*].*/;
    if (illegalRegexExp.test(req.body.name)) {
      res.status(400).send("Illegal name param");
      return;
    }

    await shoppingList.save();
    res.json(shoppingList);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
};

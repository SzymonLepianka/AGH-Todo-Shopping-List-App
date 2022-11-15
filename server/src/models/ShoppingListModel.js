const mongoose = require('mongoose'); 

const ShoppingListSchema = new mongoose.Schema({
    shoppingListId: {
        type: String,
    },
    name: {
        type: String,
    },
    date: {
        type: String,
    },
    completed: {
        type: Boolean,
    },
    userId: {
        type: String,
    }
});

const ShoppingListModel = mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = ShoppingListModel;
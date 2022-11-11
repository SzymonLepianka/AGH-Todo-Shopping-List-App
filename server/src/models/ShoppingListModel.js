const mongoose = require('mongoose'); 

const ShoppingListSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    date: {
        type: String,
    },
    completed: {
        type: Boolean,
    }
});

const ShoppingListModel = mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = ShoppingListModel;
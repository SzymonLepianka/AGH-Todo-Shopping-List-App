const express = require('express');
const { isLoggedIn } = require('./middleware/isLoggedIn');

const createTodoRoute = require('./routes/createTodoRoute')
const readTodosRoute = require('./routes/readTodosRoute')
const updateTodoRoute = require('./routes/updateTodoRoute')
const deleteTodoRoute = require('./routes/deleteTodoRoute')

const createShoppingListRoute = require('./routes/createShoppingListRoute')
const readShoppingListsRoute = require('./routes/readShoppingListsRoute')
const updateShoppingListRoute = require('./routes/updateShoppingListRoute')
const deleteShoppingListRoute = require('./routes/deleteShoppingListRoute')

const router = express.Router();

router.post('/login', require('./routes/loginRoute'));
router.post('/register', require('./routes/registerRoute'));

router.post('/todos', isLoggedIn, createTodoRoute);
router.get('/todos/:shoppingListId', isLoggedIn, readTodosRoute);
router.put('/todos/:id', isLoggedIn, updateTodoRoute);
router.delete('/todos/:id', isLoggedIn, deleteTodoRoute);

router.post('/shoppingLists', isLoggedIn, createShoppingListRoute);
router.get('/shoppingLists', isLoggedIn, readShoppingListsRoute);
router.put('/shoppingLists/:id', isLoggedIn, updateShoppingListRoute);
router.delete('/shoppingLists/:id', isLoggedIn, deleteShoppingListRoute);

module.exports = router;
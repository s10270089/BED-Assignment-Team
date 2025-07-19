const model = require("../models/shoplistModel");

// Get all lists for a user
exports.getLists = async (req, res) => {
  const userId = req.user.user_id;
  const lists = await model.getShoppingListsByUser(userId);
  res.json(lists);
};

// Create a new list
exports.createList = async (req, res) => {
  const userId = req.user.user_id;
  const { title } = req.body;
  const list = await model.createShoppingList(userId, title);
  res.status(201).json(list);
};

// Delete a list and its items
exports.deleteList = async (req, res) => {
  const { listId } = req.params;
  await model.deleteShoppingList(parseInt(listId));
  res.json({ message: "List deleted" });
};

// Add an item to a list
exports.addItem = async (req, res) => {
  const { listId } = req.params;
  const { item_name, quantity, notes } = req.body;
  const item = await model.addItem(parseInt(listId), item_name, quantity, notes);
  res.status(201).json(item);
};

// Get items in a list
exports.getItems = async (req, res) => {
  const { listId } = req.params;
  const items = await model.getItemsByList(parseInt(listId));
  res.json(items);
};

// Update a single item
exports.updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { item_name, quantity, notes } = req.body;
  await model.updateItem(parseInt(itemId), item_name, quantity, notes);
  res.json({ message: "Item updated" });
};

// Delete a single item
exports.deleteItem = async (req, res) => {
  const { itemId } = req.params;
  await model.deleteItem(parseInt(itemId));
  res.json({ message: "Item deleted" });
};

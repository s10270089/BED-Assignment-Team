const model = require("../models/shoplistModel");

// Get all items for the user's shopping list
exports.getItems = async (req, res) => {
  const userId = req.user.user_id;
  const items = await model.getItemsByUser(userId);
  res.json(items);
};

// Add an item to the user's shopping list
exports.addItem = async (req, res) => {
  const userId = req.user.user_id;
  const { item_name, item_type, amount, notes } = req.body;
  const item = await model.addItem(userId, item_name, item_type, amount, notes);
  res.status(201).json(item);
};

// Update a single item
exports.updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { item_name, item_type, amount, notes } = req.body;
  await model.updateItem(parseInt(itemId), item_name, item_type, amount, notes);
  res.json({ message: "Item updated" });
};

// Delete a single item
exports.deleteItem = async (req, res) => {
  const { itemId } = req.params;
  await model.deleteItem(parseInt(itemId));
  res.json({ message: "Item deleted" });
};

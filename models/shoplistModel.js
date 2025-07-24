const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all lists for a user
exports.getShoppingListsByUser = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM ShoppingLists WHERE user_id = @userId ORDER BY created_at DESC");
  return result.recordset;
};

// Create a new list
exports.createShoppingList = async (userId, title) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .input("title", sql.NVarChar, title)
    .query("INSERT INTO ShoppingLists (user_id, title) OUTPUT INSERTED.* VALUES (@userId, @title)");
  return result.recordset[0];
};

// Delete list and its items gg 
exports.deleteShoppingList = async (listId) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("listId", sql.Int, listId)
    .query("DELETE FROM ShoppingListItems WHERE list_id = @listId; DELETE FROM ShoppingLists WHERE list_id = @listId;");
};

// Add an item to a list
exports.addItem = async (listId, itemName, quantity, notes) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("listId", sql.Int, listId)
    .input("itemName", sql.NVarChar, itemName)
    .input("quantity", sql.Int, quantity)
    .input("notes", sql.NVarChar, notes)
    .query("INSERT INTO ShoppingListItems (list_id, item_name, quantity, notes) OUTPUT INSERTED.* VALUES (@listId, @itemName, @quantity, @notes)");
  return result.recordset[0];
};

// Get items for a list
exports.getItemsByList = async (listId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("listId", sql.Int, listId)
    .query("SELECT * FROM ShoppingListItems WHERE list_id = @listId");
  return result.recordset;
};

// Update an item
exports.updateItem = async (itemId, itemName, quantity, notes) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("itemId", sql.Int, itemId)
    .input("itemName", sql.NVarChar, itemName)
    .input("quantity", sql.Int, quantity)
    .input("notes", sql.NVarChar, notes)
    .query("UPDATE ShoppingListItems SET item_name = @itemName, quantity = @quantity, notes = @notes WHERE item_id = @itemId");
};

// Delete an item
exports.deleteItem = async (itemId) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("itemId", sql.Int, itemId)
    .query("DELETE FROM ShoppingListItems WHERE item_id = @itemId");
};

const sql = require("mssql");
const dbConfig = require("../dbConfig.js");

// Get all lists for a user
exports.getItemsByUser = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM ShoppingListItems WHERE user_id = @userId");
  return result.recordset;
};

// Add an item for the user
exports.addItem = async (userId, itemName, itemType, amount, notes) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .input("itemName", sql.NVarChar, itemName)
    .input("itemType", sql.NVarChar, itemType)
    .input("amount", sql.NVarChar, amount)
    .input("notes", sql.NVarChar, notes)
    .query(`INSERT INTO ShoppingListItems (user_id, item_name, item_type, amount, notes)
            OUTPUT INSERTED.* VALUES (@userId, @itemName, @itemType, @amount, @notes)`);
  return result.recordset[0];
};

// Update an item
exports.updateItem = async (itemId, itemName, itemType, amount, notes) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("itemId", sql.Int, itemId)
    .input("itemName", sql.NVarChar, itemName)
    .input("itemType", sql.NVarChar, itemType)
    .input("amount", sql.NVarChar, amount)
    .input("notes", sql.NVarChar, notes)
    .query("UPDATE ShoppingListItems SET item_name = @itemName, item_type = @itemType, amount = @amount, notes = @notes WHERE item_id = @itemId");
};

// Delete an item
exports.deleteItem = async (itemId) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("itemId", sql.Int, itemId)
    .query("DELETE FROM ShoppingListItems WHERE item_id = @itemId");
};
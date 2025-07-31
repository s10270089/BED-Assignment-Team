const express = require("express");
const router = express.Router();
const controller = require("../controllers/shoplistController");
const authenticate = require("../middlewares/authenticateShoppingList");
const { validateList, validateItem } = require("../middlewares/validateShoplist");


// All routes require authentication
router.use(authenticate);

// Item Routes
router.get("/items", controller.getItems); // Get all items
router.post("/items", validateItem, controller.addItem); // Add item
router.put("/items/:itemId", validateItem, controller.updateItem); // Update item
router.delete("/items/:itemId", controller.deleteItem); // Delete item

module.exports = router;

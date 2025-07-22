const express = require("express");
const router = express.Router();
const controller = require("../controllers/shoplistController");
const authenticate = require("../../shopping_list/middlewares/authenticate");
const { validateList, validateItem } = require("../middlewares/validateShoplist");


// All routes require authentication
router.use(authenticate);

// List Routes
router.get("/", controller.getLists); // Get all lists
router.post("/", validateList, controller.createList); // Create list
router.delete("/:listId", controller.deleteList); // Delete list

// Item Routes
router.get("/:listId/items", controller.getItems); // Get items in a list
router.post("/:listId/items", validateItem, controller.addItem); // Add item
router.put("/items/:itemId", validateItem, controller.updateItem); // Update item
router.delete("/items/:itemId", controller.deleteItem); // Delete item

module.exports = router;

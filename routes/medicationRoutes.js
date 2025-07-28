const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicationController");
const validate = require("../middlewares/validateMedication");
const authenticate = require("../middlewares/authenticate"); // ✅ your local one

router.use(authenticate); // 🔒 protect all routes

router.get("/", controller.getAllMedications);
router.get("/:id", controller.getMedicationById);
router.post("/", validate, controller.createMedication);
router.put("/:id", validate, controller.updateMedication);
router.delete("/:id", controller.deleteMedication);

module.exports = router;

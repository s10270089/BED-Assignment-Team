const express = require("express");
const router = express.Router();
const controller = require("../controller/medicationController");
const validate = require("../middleware/validateMedication");
const authenticate = require("../middleware/authenticate"); // ✅ your local one

router.use(authenticate); // 🔒 protect all routes

router.get("/", controller.getAllMedications);
router.get("/:id", controller.getMedicationById);
router.post("/", validate, controller.createMedication);
router.put("/:id", validate, controller.updateMedication);
router.delete("/:id", controller.deleteMedication);

module.exports = router;

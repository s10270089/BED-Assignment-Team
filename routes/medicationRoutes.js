const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicationController");
const validate = require("../middlewares/validateMedication");
const authenticate = require("../middlewares/authenticateMedication");

router.use(authenticate);

/**
 * @swagger
 * /medications:
 *   get:
 *     summary: Get all medications for a user
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of medications
 */
router.get("/", controller.getAllMedications);

/**
 * @swagger
 * /medications/{id}:
 *   get:
 *     summary: Get one medication by ID
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Medication found
 *       404:
 *         description: Not found
 */
router.get("/:id", controller.getMedicationById);

/**
 * @swagger
 * /medications:
 *   post:
 *     summary: Add a new medication
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               dosage: { type: string }
 *               time: { type: string }
 *               frequency: { type: string }
 *     responses:
 *       200:
 *         description: Medication created
 */
router.post("/", validate, controller.createMedication);

/**
 * @swagger
 * /medications/{id}:
 *   put:
 *     summary: Update a medication
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:id", validate, controller.updateMedication);

/**
 * @swagger
 * /medications/{id}:
 *   delete:
 *     summary: Delete a medication
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", controller.deleteMedication);

module.exports = router;

const express = require('express');
const router = express.Router();
const healthRecordController = require('../controller/healthRecordController');
const authenticate = require("../middleware/authenticate"); // Only this needed

// Use only `authenticate` for protected routes
router.get('/', authenticate, healthRecordController.getAllHealthRecords);
router.get('/:id', authenticate, healthRecordController.getHealthRecordById);
router.post('/', authenticate, healthRecordController.createHealthRecord);
router.put('/:id', authenticate, healthRecordController.updateHealthRecord);
router.delete('/:id', authenticate, healthRecordController.deleteHealthRecord);

module.exports = router;

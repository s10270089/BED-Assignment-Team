const express = require('express');
const router = express.Router();
const healthRecordController = require('../controller/healthRecordController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.get('/', authMiddleware, healthRecordController.getAllHealthRecords);
router.get('/:id', authMiddleware, healthRecordController.getHealthRecordById);
router.post('/', authMiddleware, healthRecordController.createHealthRecord);
router.put('/:id', authMiddleware, healthRecordController.updateHealthRecord);
router.delete('/:id', authMiddleware, healthRecordController.deleteHealthRecord);

module.exports = router;
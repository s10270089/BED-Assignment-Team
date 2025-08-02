const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');
const authenticate = require("../middlewares/authenticate"); // Only this needed

// Use only `authenticate` for protected routes
router.get('/', authenticate, healthRecordController.getAllHealthRecords);
router.get('/:id', authenticate, healthRecordController.getHealthRecordById);
router.post('/', authenticate, healthRecordController.createHealthRecord);
router.put('/:id', authenticate, healthRecordController.updateHealthRecord);
router.delete('/:id', authenticate, healthRecordController.deleteHealthRecord);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getMaintenanceRecords,
  getMaintenanceRecord,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord
} = require('../controllers/maintenance.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Get all maintenance records for a specific equipment
router.get('/equipment/:equipmentId', getMaintenanceRecords);

// CRUD operations for maintenance records
router.route('/')
  .post(createMaintenanceRecord);

router.route('/:id')
  .get(getMaintenanceRecord)
  .put(updateMaintenanceRecord)
  .delete(deleteMaintenanceRecord);

module.exports = router;
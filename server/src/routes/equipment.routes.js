const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  shareEquipment
} = require('../controllers/equipment.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Base equipment routes
router.route('/')
  .get(getEquipment)
  .post(createEquipment);

// Equipment operations by ID
router.route('/:id')
  .get(getEquipmentById)
  .put(updateEquipment)
  .delete(deleteEquipment);

// Share equipment
router.post('/:id/share', shareEquipment);

module.exports = router;
const MaintenanceRecord = require('../models/MaintenanceRecord');
const Equipment = require('../models/Equipment');

// @desc    Get all maintenance records for a specific equipment
// @route   GET /api/maintenance/equipment/:equipmentId
// @access  Private
exports.getMaintenanceRecords = async (req, res) => {
  try {
    const { equipmentId } = req.params;

    // Verify equipment belongs to user
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        message: 'Equipment not found'
      });
    }

    if (equipment.userId.toString() !== req.user.id && !equipment.isShared) {
      return res.status(401).json({
        message: 'Not authorized to access this equipment'
      });
    }

    const maintenanceRecords = await MaintenanceRecord.find({ equipmentId })
      .sort({ date: -1 });

    res.json(maintenanceRecords);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Get a specific maintenance record
// @route   GET /api/maintenance/:id
// @access  Private
exports.getMaintenanceRecord = async (req, res) => {
  try {
    const maintenanceRecord = await MaintenanceRecord.findById(req.params.id);

    if (!maintenanceRecord) {
      return res.status(404).json({
        message: 'Maintenance record not found'
      });
    }

    // Verify equipment belongs to user
    const equipment = await Equipment.findById(maintenanceRecord.equipmentId);
    if (equipment.userId.toString() !== req.user.id && !equipment.isShared) {
      return res.status(401).json({
        message: 'Not authorized to access this maintenance record'
      });
    }

    res.json(maintenanceRecord);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Create a new maintenance record
// @route   POST /api/maintenance
// @access  Private
exports.createMaintenanceRecord = async (req, res) => {
  try {
    const {
      equipmentId,
      type,
      date,
      description,
      technician,
      cost,
      partsReplaced,
      notes,
      beforeImages,
      afterImages,
      nextScheduledDate,
      environmentalConditions
    } = req.body;

    // Verify equipment belongs to user
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        message: 'Equipment not found'
      });
    }

    if (equipment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized to add maintenance to this equipment'
      });
    }

    const maintenanceRecord = await MaintenanceRecord.create({
      equipmentId,
      type,
      date: date || new Date(),
      description,
      technician,
      cost,
      partsReplaced,
      notes,
      beforeImages,
      afterImages,
      nextScheduledDate,
      performedBy: req.user.id,
      environmentalConditions
    });

    // Update equipment with maintenance dates
    equipment.lastMaintenanceDate = date || new Date();
    equipment.nextMaintenanceDate = nextScheduledDate;
    await equipment.save();

    res.status(201).json(maintenanceRecord);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Update a maintenance record
// @route   PUT /api/maintenance/:id
// @access  Private
exports.updateMaintenanceRecord = async (req, res) => {
  try {
    let maintenanceRecord = await MaintenanceRecord.findById(req.params.id);

    if (!maintenanceRecord) {
      return res.status(404).json({
        message: 'Maintenance record not found'
      });
    }

    // Verify equipment belongs to user
    const equipment = await Equipment.findById(maintenanceRecord.equipmentId);
    if (equipment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized to update this maintenance record'
      });
    }

    maintenanceRecord = await MaintenanceRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Update equipment with maintenance dates if needed
    if (req.body.nextScheduledDate) {
      equipment.nextMaintenanceDate = req.body.nextScheduledDate;
      await equipment.save();
    }

    res.json(maintenanceRecord);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Delete a maintenance record
// @route   DELETE /api/maintenance/:id
// @access  Private
exports.deleteMaintenanceRecord = async (req, res) => {
  try {
    const maintenanceRecord = await MaintenanceRecord.findById(req.params.id);

    if (!maintenanceRecord) {
      return res.status(404).json({
        message: 'Maintenance record not found'
      });
    }

    // Verify equipment belongs to user
    const equipment = await Equipment.findById(maintenanceRecord.equipmentId);
    if (equipment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized to delete this maintenance record'
      });
    }

    await maintenanceRecord.remove();

    // Update equipment's last maintenance date to previous record
    const latestRecord = await MaintenanceRecord.findOne({ 
      equipmentId: maintenanceRecord.equipmentId 
    }).sort({ date: -1 });

    if (latestRecord) {
      equipment.lastMaintenanceDate = latestRecord.date;
      equipment.nextMaintenanceDate = latestRecord.nextScheduledDate;
    } else {
      equipment.lastMaintenanceDate = null;
      equipment.nextMaintenanceDate = null;
    }

    await equipment.save();

    res.json({ message: 'Maintenance record removed' });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
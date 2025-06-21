const Equipment = require('../models/Equipment');
const MaintenanceRecord = require('../models/MaintenanceRecord');

// @desc    Get all equipment for a user
// @route   GET /api/equipment
// @access  Private
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ userId: req.user.id });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Get single equipment item
// @route   GET /api/equipment/:id
// @access  Private
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    // Check if equipment exists
    if (!equipment) {
      return res.status(404).json({
        message: 'Equipment not found'
      });
    }

    // Check if equipment belongs to user
    if (equipment.userId.toString() !== req.user.id && !equipment.isShared) {
      return res.status(401).json({
        message: 'Not authorized to access this equipment'
      });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private
exports.createEquipment = async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      make,
      model,
      serialNumber,
      purchaseDate,
      purchasePrice,
      currentValue,
      description,
      specs,
      location,
      images
    } = req.body;

    // Create new equipment
    const equipment = await Equipment.create({
      userId: req.user.id,
      name,
      type,
      category,
      make,
      model,
      serialNumber,
      purchaseDate,
      purchasePrice,
      currentValue: currentValue || purchasePrice, // Default to purchase price if not provided
      description,
      specs,
      location,
      images
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
exports.updateEquipment = async (req, res) => {
  try {
    let equipment = await Equipment.findById(req.params.id);

    // Check if equipment exists
    if (!equipment) {
      return res.status(404).json({
        message: 'Equipment not found'
      });
    }

    // Check if equipment belongs to user
    if (equipment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized to update this equipment'
      });
    }

    // Update equipment
    equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    // Check if equipment exists
    if (!equipment) {
      return res.status(404).json({
        message: 'Equipment not found'
      });
    }

    // Check if equipment belongs to user
    if (equipment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized to delete this equipment'
      });
    }

    // Delete all related maintenance records
    await MaintenanceRecord.deleteMany({ equipmentId: req.params.id });
    
    // Delete equipment
    await equipment.remove();

    res.json({ message: 'Equipment removed' });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Share equipment with another user
// @route   POST /api/equipment/:id/share
// @access  Private
exports.shareEquipment = async (req, res) => {
  try {
    const { userId } = req.body;
    const equipment = await Equipment.findById(req.params.id);

    // Check if equipment exists
    if (!equipment) {
      return res.status(404).json({
        message: 'Equipment not found'
      });
    }

    // Check if equipment belongs to user
    if (equipment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized to share this equipment'
      });
    }

    // Check if already shared with this user
    if (equipment.sharedWith.includes(userId)) {
      return res.status(400).json({
        message: 'Equipment already shared with this user'
      });
    }

    // Add user to sharedWith array
    equipment.isShared = true;
    equipment.sharedWith.push(userId);
    await equipment.save();

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
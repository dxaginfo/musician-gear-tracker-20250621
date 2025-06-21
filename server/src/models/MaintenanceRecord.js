const mongoose = require('mongoose');

const MaintenanceRecordSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    type: {
      type: String,
      enum: ['routine', 'repair', 'upgrade'],
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    description: {
      type: String,
      required: [true, 'Description of maintenance is required'],
      trim: true
    },
    technician: {
      type: String,
      trim: true
    },
    cost: {
      type: Number,
      min: 0,
      default: 0
    },
    partsReplaced: [
      {
        name: {
          type: String,
          required: true
        },
        cost: {
          type: Number,
          min: 0,
          default: 0
        }
      }
    ],
    notes: {
      type: String,
      trim: true
    },
    beforeImages: [
      {
        type: String
      }
    ],
    afterImages: [
      {
        type: String
      }
    ],
    nextScheduledDate: {
      type: Date
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    environmentalConditions: {
      temperature: {
        type: Number
      },
      humidity: {
        type: Number
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
MaintenanceRecordSchema.index({ equipmentId: 1 });
MaintenanceRecordSchema.index({ date: 1 });
MaintenanceRecordSchema.index({ nextScheduledDate: 1 });
MaintenanceRecordSchema.index({ type: 1 });

// Calculate total cost including parts
MaintenanceRecordSchema.virtual('totalCost').get(function() {
  const partsCost = this.partsReplaced.reduce(
    (total, part) => total + (part.cost || 0),
    0
  );
  return (this.cost || 0) + partsCost;
});

// Method to check if maintenance is overdue
MaintenanceRecordSchema.methods.isOverdue = function() {
  if (!this.nextScheduledDate) return false;
  return this.nextScheduledDate < new Date();
};

module.exports = mongoose.model('MaintenanceRecord', MaintenanceRecordSchema);
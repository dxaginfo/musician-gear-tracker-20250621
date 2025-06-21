const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Equipment type is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    make: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    serialNumber: {
      type: String,
      trim: true
    },
    purchaseDate: {
      type: Date
    },
    purchasePrice: {
      type: Number,
      min: 0
    },
    currentValue: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      trim: true
    },
    specs: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    location: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'in repair', 'sold', 'lost'],
      default: 'active'
    },
    images: [
      {
        url: {
          type: String,
          required: true
        },
        caption: {
          type: String,
          trim: true
        },
        dateAdded: {
          type: Date,
          default: Date.now
        }
      }
    ],
    components: [
      {
        name: {
          type: String,
          required: true
        },
        type: {
          type: String,
          required: true
        },
        installDate: {
          type: Date,
          default: Date.now
        },
        notes: {
          type: String
        }
      }
    ],
    isShared: {
      type: Boolean,
      default: false
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    lastMaintenanceDate: {
      type: Date
    },
    nextMaintenanceDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
EquipmentSchema.index({ userId: 1 });
EquipmentSchema.index({ type: 1 });
EquipmentSchema.index({ category: 1 });
EquipmentSchema.index({ status: 1 });
EquipmentSchema.index({ nextMaintenanceDate: 1 });

// Virtual for calculating days until next maintenance
EquipmentSchema.virtual('daysUntilMaintenance').get(function() {
  if (!this.nextMaintenanceDate) return null;
  const now = new Date();
  const diff = this.nextMaintenanceDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
});

// Method to update currentValue based on depreciation or appreciation
EquipmentSchema.methods.updateCurrentValue = function(ratePerYear, isAppreciation = false) {
  if (!this.purchasePrice || !this.purchaseDate) return this.currentValue;
  
  const now = new Date();
  const purchaseDate = new Date(this.purchaseDate);
  const yearsOwned = (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365);
  
  if (isAppreciation) {
    // For appreciation (vintage instruments)
    this.currentValue = this.purchasePrice * Math.pow(1 + ratePerYear, yearsOwned);
  } else {
    // For depreciation (standard equipment)
    this.currentValue = this.purchasePrice * Math.pow(1 - ratePerYear, yearsOwned);
  }
  
  return this.currentValue;
};

module.exports = mongoose.model('Equipment', EquipmentSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please provide a valid email address'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    role: {
      type: String,
      enum: ['musician', 'technician', 'admin'],
      default: 'musician'
    },
    preferences: {
      notificationSettings: {
        type: Map,
        of: Boolean,
        default: {
          maintenanceReminders: true,
          environmentalAlerts: true,
          usageReminders: true,
          emailNotifications: true
        }
      },
      defaultCategories: {
        type: [String],
        default: []
      },
      displayOptions: {
        type: Map,
        of: String,
        default: {
          theme: 'light',
          dateFormat: 'MM/DD/YYYY',
          defaultView: 'list'
        }
      }
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('passwordHash')) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
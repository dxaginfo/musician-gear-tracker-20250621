const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const MaintenanceRecord = require('../models/MaintenanceRecord');

// Sample equipment types for demo data
const equipmentTypes = [
  'Electric Guitar',
  'Acoustic Guitar',
  'Bass Guitar',
  'Keyboard',
  'Drum Kit',
  'Microphone',
  'Amplifier',
  'Effect Pedal',
  'Audio Interface',
  'Mixer',
  'MIDI Controller',
  'Headphones',
  'Monitor Speaker',
  'Studio Monitor',
  'Violin',
  'Saxophone',
  'Trumpet'
];

// Categories for organization
const categories = [
  'String Instruments',
  'Percussion',
  'Wind Instruments',
  'Recording Equipment',
  'Sound Reinforcement',
  'Effects & Processors',
  'Accessories',
  'Keyboards & Digital Instruments'
];

// Sample locations
const locations = ['Home Studio', 'Main Storage', 'Rehearsal Space', 'Tour Van', 'On Loan', 'On Stage'];

// Migration script
const migrate = async () => {
  try {
    console.log('Starting database migration...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/musician-gear-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data (be careful with this in production)
    if (process.env.NODE_ENV !== 'production') {
      await User.deleteMany({});
      await Equipment.deleteMany({});
      await MaintenanceRecord.deleteMany({});
      console.log('Cleared existing data');
    }

    // Create admin user
    const adminPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'admin'
    });
    
    console.log('Created admin user:', admin.email);

    // Create regular user
    const userPassword = 'user123';
    const userSalt = await bcrypt.genSalt(10);
    const userHashedPassword = await bcrypt.hash(userPassword, userSalt);
    
    const user = await User.create({
      name: 'John Musician',
      email: 'musician@example.com',
      passwordHash: userHashedPassword,
      role: 'musician'
    });
    
    console.log('Created regular user:', user.email);
    
    // Create sample equipment for the regular user
    const demoEquipment = [
      {
        userId: user._id,
        name: 'Fender Stratocaster',
        type: 'Electric Guitar',
        category: 'String Instruments',
        make: 'Fender',
        model: 'Stratocaster',
        serialNumber: 'US20150123',
        purchaseDate: new Date('2020-03-15'),
        purchasePrice: 1200,
        currentValue: 1150,
        description: 'American-made Stratocaster with maple fretboard',
        specs: {
          pickups: 'Single-coil',
          color: 'Sunburst',
          frets: 22
        },
        location: 'Home Studio',
        status: 'active',
        images: [
          {
            url: 'https://example.com/images/strat.jpg',
            caption: 'Main view',
            dateAdded: new Date()
          }
        ]
      },
      {
        userId: user._id,
        name: 'Shure SM58',
        type: 'Microphone',
        category: 'Recording Equipment',
        make: 'Shure',
        model: 'SM58',
        serialNumber: 'SM5812345',
        purchaseDate: new Date('2019-05-20'),
        purchasePrice: 99,
        currentValue: 90,
        description: 'Standard vocal microphone',
        location: 'Rehearsal Space',
        status: 'active'
      }
    ];
    
    // Insert sample equipment
    const equipment = await Equipment.insertMany(demoEquipment);
    console.log(`Created ${equipment.length} sample equipment items`);
    
    // Create sample maintenance records
    const maintenanceRecords = [
      {
        equipmentId: equipment[0]._id,
        type: 'routine',
        date: new Date('2021-05-15'),
        description: 'String change and setup',
        technician: 'Self',
        cost: 25,
        partsReplaced: [
          {
            name: 'Strings (Ernie Ball Regular Slinky)',
            cost: 8
          }
        ],
        notes: 'Adjusted action and intonation',
        performedBy: user._id,
        nextScheduledDate: new Date('2022-02-15')
      },
      {
        equipmentId: equipment[0]._id,
        type: 'repair',
        date: new Date('2022-01-10'),
        description: 'Fixed output jack',
        technician: 'Guitar Center Repair',
        cost: 45,
        partsReplaced: [
          {
            name: 'Output jack',
            cost: 12
          }
        ],
        notes: 'Jack was loose and causing signal dropouts',
        performedBy: user._id
      }
    ];
    
    // Insert sample maintenance records
    await MaintenanceRecord.insertMany(maintenanceRecords);
    console.log(`Created ${maintenanceRecords.length} sample maintenance records`);
    
    // Update equipment with last maintenance date
    equipment[0].lastMaintenanceDate = maintenanceRecords[1].date;
    equipment[0].nextMaintenanceDate = maintenanceRecords[0].nextScheduledDate;
    await equipment[0].save();
    
    console.log('Database migration completed successfully');
    mongoose.disconnect();
    
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
} else {
  // Export for use in other scripts
  module.exports = migrate;
}
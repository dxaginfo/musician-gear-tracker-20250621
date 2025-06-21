# Musician Gear Tracker

A comprehensive web application for musicians to track, maintain, and manage their musical equipment inventory.

## 🎸 Overview

Musician Gear Tracker is a Progressive Web Application (PWA) designed to help musicians keep track of their instruments and equipment with specialized features for maintenance scheduling, condition monitoring, and valuation tracking. This application addresses a significant gap in the market for specialized tools that combine inventory management with maintenance tracking specifically tailored for musical equipment.

## ⚙ Features

### Core Features

- **Inventory Management**: Catalog all your musical equipment with detailed specifications, categorization, photos, and location tracking
- **Maintenance Tracking**: Schedule routine maintenance, log service history, and receive notifications when maintenance is due
- **Condition Monitoring**: Track environmental conditions (humidity, temperature) that affect instruments and document wear over time
- **Equipment Valuation**: Record purchase prices and current values for insurance purposes and generate documentation
- **Offline Functionality**: Access your gear information without internet connectivity and sync when you're back online

### Advanced Features

- **Usage Tracking**: Log playing hours and gigs/sessions to associate wear with specific events
- **Collaborative Features**: Share inventory access with band members, teachers, or repair technicians
- **Integration Capabilities**: Scan barcodes/QR codes, export data, and integrate with calendar apps

## 🛠️ Technology Stack

### Frontend
- React.js with TypeScript
- Material-UI for responsive design components
- Redux with Redux Toolkit for state management
- Workbox for PWA support and offline capabilities
- Formik with Yup for form validation
- Chart.js for maintenance history visualizations

### Backend
- Node.js with Express.js
- RESTful API with OpenAPI specification
- JWT with OAuth 2.0 for authentication
- MongoDB for equipment data storage
- AWS S3 for image storage
- Redis for caching
- Elasticsearch for search functionality

### Mobile Support
- Progressive Web App (PWA) with responsive design
- Camera API for barcode scanning
- Geolocation API for location tracking
- IndexedDB for offline data storage

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/musician-gear-tracker-20250621.git
   cd musician-gear-tracker-20250621
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Environment setup:
   - Create a `.env` file in the server directory based on `.env.example`
   - Set up your MongoDB connection string, AWS credentials, and JWT secret

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend development server
   cd ../client
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Docker Setup

You can also use Docker to run the application:

```bash
docker-compose up
```

## 📱 Mobile App Installation (PWA)

1. Open the application in a supported browser (Chrome, Edge, Safari)
2. For iOS: Tap the Share button and select "Add to Home Screen"
3. For Android: Tap the menu button and select "Install App"

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Equipment

- `GET /api/equipment` - Get all equipment for the authenticated user
- `GET /api/equipment/:id` - Get a specific equipment item
- `POST /api/equipment` - Create a new equipment item
- `PUT /api/equipment/:id` - Update an equipment item
- `DELETE /api/equipment/:id` - Delete an equipment item
- `POST /api/equipment/:id/share` - Share equipment with another user

### Maintenance

- `GET /api/maintenance/equipment/:equipmentId` - Get all maintenance records for an equipment
- `GET /api/maintenance/:id` - Get a specific maintenance record
- `POST /api/maintenance` - Create a new maintenance record
- `PUT /api/maintenance/:id` - Update a maintenance record
- `DELETE /api/maintenance/:id` - Delete a maintenance record

## Demo Accounts

After running the database migration, you can use these demo accounts:

1. Admin User:
   - Email: admin@example.com
   - Password: admin123

2. Regular User:
   - Email: musician@example.com
   - Password: user123

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- IoT integration for automated environmental monitoring
- AI-powered maintenance predictions based on usage patterns
- Integration with music marketplace APIs for current valuation
- AR features for visual gear placement and identification

## 📞 Contact

For questions or support, please open an issue in the GitHub repository.
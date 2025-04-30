# Smart Vital Guardian Backend

This is the backend server for the Smart Vital Guardian healthcare management system. It provides RESTful APIs for managing patients, health metrics, and user authentication.

## Features

- User authentication and authorization
- Patient management (CRUD operations)
- Health metrics tracking
- Role-based access control
- Data validation
- Secure password handling
- JWT-based authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smart-vital-guardian
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Patients
- GET `/api/patients` - Get all patients
- GET `/api/patients/:id` - Get single patient
- POST `/api/patients` - Create new patient
- PUT `/api/patients/:id` - Update patient
- DELETE `/api/patients/:id` - Delete patient
- POST `/api/patients/:id/health-metrics` - Add health metrics
- GET `/api/patients/:id/health-metrics` - Get patient health metrics

## Development

- The server uses nodemon for development
- ESLint is configured for code linting
- Jest is set up for testing

## Testing

Run tests with:
```bash
npm test
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation is implemented using express-validator
- CORS is enabled for frontend communication
- Environment variables are used for sensitive data

## Error Handling

The API includes comprehensive error handling for:
- Invalid input data
- Authentication failures
- Database errors
- Not found resources
- Server errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 
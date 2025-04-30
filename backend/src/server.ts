import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { apiLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';
import prescriptionRoutes from './routes/prescriptions';
import medicalRecordRoutes from './routes/medicalRecords';
import billingRoutes from './routes/billing';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'NODE_ENV'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is required but not set in environment variables`);
    process.exit(1);
  }
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-system')
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/billing', billingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 
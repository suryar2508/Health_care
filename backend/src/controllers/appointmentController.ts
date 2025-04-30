import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    userType: string;
  };
}

// Get all appointments for a doctor
export const getDoctorAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const appointments = await Appointment.find({ doctorId: userId })
      .populate('patientId', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    logger.error('Error fetching doctor appointments:', error);
    throw new AppError('Error fetching appointments', 500);
  }
};

// Get all appointments for a patient
export const getPatientAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;
    const appointments = await Appointment.find({ patientId: userId })
      .populate('doctorId', 'name specialization')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    logger.error('Error fetching patient appointments:', error);
    throw new AppError('Error fetching appointments', 500);
  }
};

// Create a new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, date, time, type, notes } = req.body;

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: 'scheduled',
    });

    if (existingAppointment) {
      throw new AppError('This time slot is already booked', 400);
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      type,
      notes,
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    logger.error('Error creating appointment:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error creating appointment', 500);
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    res.json(appointment);
  } catch (error) {
    logger.error('Error updating appointment status:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error updating appointment status', 500);
  }
};

// Get appointment statistics for a doctor
export const getDoctorStats = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.user!;

    const stats = await Appointment.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          upcomingAppointments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'scheduled'] },
                    { $gte: ['$date', new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    res.json(stats[0] || {
      totalAppointments: 0,
      completedAppointments: 0,
      upcomingAppointments: 0,
    });
  } catch (error) {
    logger.error('Error fetching doctor stats:', error);
    throw new AppError('Error fetching statistics', 500);
  }
}; 
import { Request, Response } from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await User.find({ userType: 'doctor' })
      .select('-password')
      .sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    logger.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      userType: 'doctor',
    }).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    logger.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, password, specialization } = req.body;

    // Check if doctor already exists
    const existingDoctor = await User.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // Create new doctor
    const doctor = new User({
      name,
      email,
      password,
      userType: 'doctor',
      specialization,
    });

    await doctor.save();

    res.status(201).json({
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
    });
  } catch (error) {
    logger.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Error creating doctor' });
  }
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, specialization } = req.body;
    const doctor = await User.findOne({
      _id: req.params.id,
      userType: 'doctor',
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    Object.assign(doctor, { name, email, specialization });
    await doctor.save();

    res.json({
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
    });
  } catch (error) {
    logger.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await User.findOneAndDelete({
      _id: req.params.id,
      userType: 'doctor',
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    logger.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
}; 
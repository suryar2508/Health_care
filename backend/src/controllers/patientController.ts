import { Request, Response } from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await User.find({ userType: 'patient' })
      .select('-password')
      .sort({ name: 1 });
    res.json(patients);
  } catch (error) {
    logger.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await User.findOne({
      _id: req.params.id,
      userType: 'patient',
    }).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    logger.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient' });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if patient already exists
    const existingPatient = await User.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    // Create new patient
    const patient = new User({
      name,
      email,
      password,
      userType: 'patient',
    });

    await patient.save();

    res.status(201).json({
      id: patient._id,
      name: patient.name,
      email: patient.email,
    });
  } catch (error) {
    logger.error('Error creating patient:', error);
    res.status(500).json({ message: 'Error creating patient' });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const patient = await User.findOne({
      _id: req.params.id,
      userType: 'patient',
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    Object.assign(patient, { name, email });
    await patient.save();

    res.json({
      id: patient._id,
      name: patient.name,
      email: patient.email,
    });
  } catch (error) {
    logger.error('Error updating patient:', error);
    res.status(500).json({ message: 'Error updating patient' });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await User.findOneAndDelete({
      _id: req.params.id,
      userType: 'patient',
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    logger.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Error deleting patient' });
  }
}; 
import { Request, Response } from 'express';
import { Prescription } from '../models/Prescription';
import { logger } from '../utils/logger';

export const getAllPrescriptions = async (req: Request, res: Response) => {
  try {
    const { userType, userId } = req.user!;
    let query: any = {};

    // Filter based on user type
    if (userType === 'doctor') {
      query.doctorId = userId;
    } else if (userType === 'patient') {
      query.patientId = userId;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ date: -1 });

    res.json(prescriptions);
  } catch (error) {
    logger.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
};

export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    logger.error('Error fetching prescription:', error);
    res.status(500).json({ message: 'Error fetching prescription' });
  }
};

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { patientId, medications, notes } = req.body;
    const doctorId = req.user!.userId;

    const prescription = new Prescription({
      patientId,
      doctorId,
      medications,
      notes,
      date: new Date(),
      status: 'active',
    });

    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    logger.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Error creating prescription' });
  }
};

export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const { medications, notes, status } = req.body;
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    Object.assign(prescription, { medications, notes, status });
    await prescription.save();

    res.json(prescription);
  } catch (error) {
    logger.error('Error updating prescription:', error);
    res.status(500).json({ message: 'Error updating prescription' });
  }
};

export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    logger.error('Error deleting prescription:', error);
    res.status(500).json({ message: 'Error deleting prescription' });
  }
};

export const refillPrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.status !== 'active') {
      return res.status(400).json({ message: 'Prescription is not active' });
    }

    if (prescription.refills <= 0) {
      return res.status(400).json({ message: 'No refills remaining' });
    }

    prescription.refills -= 1;
    await prescription.save();

    res.json(prescription);
  } catch (error) {
    logger.error('Error refilling prescription:', error);
    res.status(500).json({ message: 'Error refilling prescription' });
  }
}; 
import { Request, Response } from 'express';
import { MedicalRecord } from '../models/MedicalRecord';
import { logger } from '../utils/logger';

export const getAllMedicalRecords = async (req: Request, res: Response) => {
  try {
    const { userType, userId } = req.user!;
    let query: any = {};

    // Filter based on user type
    if (userType === 'doctor') {
      query.doctorId = userId;
    } else if (userType === 'patient') {
      query.patientId = userId;
    }

    const records = await MedicalRecord.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    logger.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Error fetching medical records' });
  }
};

export const getMedicalRecordById = async (req: Request, res: Response) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    logger.error('Error fetching medical record:', error);
    res.status(500).json({ message: 'Error fetching medical record' });
  }
};

export const createMedicalRecord = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, diagnosis, treatment, notes } = req.body;
    const record = new MedicalRecord({
      patientId,
      doctorId,
      diagnosis,
      treatment,
      notes,
      date: new Date(),
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    logger.error('Error creating medical record:', error);
    res.status(500).json({ message: 'Error creating medical record' });
  }
};

export const updateMedicalRecord = async (req: Request, res: Response) => {
  try {
    const { diagnosis, treatment, notes } = req.body;
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    Object.assign(record, { diagnosis, treatment, notes });
    await record.save();

    res.json(record);
  } catch (error) {
    logger.error('Error updating medical record:', error);
    res.status(500).json({ message: 'Error updating medical record' });
  }
};

export const deleteMedicalRecord = async (req: Request, res: Response) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    logger.error('Error deleting medical record:', error);
    res.status(500).json({ message: 'Error deleting medical record' });
  }
}; 
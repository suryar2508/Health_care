import { Request, Response } from 'express';
import { Bill } from '../models/Bill';
import { logger } from '../utils/logger';

export const getAllBills = async (req: Request, res: Response) => {
  try {
    const { userType, userId } = req.user!;
    let query: any = {};

    // Filter based on user type
    if (userType === 'doctor') {
      query.doctorId = userId;
    } else if (userType === 'patient') {
      query.patientId = userId;
    }

    const bills = await Bill.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ date: -1 });

    res.json(bills);
  } catch (error) {
    logger.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Error fetching bills' });
  }
};

export const getBillById = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json(bill);
  } catch (error) {
    logger.error('Error fetching bill:', error);
    res.status(500).json({ message: 'Error fetching bill' });
  }
};

export const createBill = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, items, total, notes } = req.body;
    const bill = new Bill({
      patientId,
      doctorId,
      items,
      total,
      notes,
      date: new Date(),
      status: 'pending',
    });

    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    logger.error('Error creating bill:', error);
    res.status(500).json({ message: 'Error creating bill' });
  }
};

export const updateBill = async (req: Request, res: Response) => {
  try {
    const { items, total, notes, status } = req.body;
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    Object.assign(bill, { items, total, notes, status });
    await bill.save();

    res.json(bill);
  } catch (error) {
    logger.error('Error updating bill:', error);
    res.status(500).json({ message: 'Error updating bill' });
  }
};

export const deleteBill = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    logger.error('Error deleting bill:', error);
    res.status(500).json({ message: 'Error deleting bill' });
  }
};

export const payBill = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (bill.status === 'paid') {
      return res.status(400).json({ message: 'Bill is already paid' });
    }

    bill.status = 'paid';
    bill.paymentDate = new Date();
    await bill.save();

    res.json(bill);
  } catch (error) {
    logger.error('Error paying bill:', error);
    res.status(500).json({ message: 'Error paying bill' });
  }
}; 
import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  payBill,
} from '../controllers/billingController';

const router = express.Router();

// Get all bills
router.get('/', auth(['admin', 'doctor']), getAllBills);

// Get bill by ID
router.get('/:id', auth(['admin', 'doctor', 'patient']), getBillById);

// Create new bill
router.post('/', auth(['admin', 'doctor']), createBill);

// Update bill
router.put('/:id', auth(['admin', 'doctor']), updateBill);

// Delete bill
router.delete('/:id', auth(['admin']), deleteBill);

// Pay bill
router.post('/:id/pay', auth(['admin', 'patient']), payBill);

export default router; 
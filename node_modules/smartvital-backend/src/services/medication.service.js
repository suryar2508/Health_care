const Medication = require('../models/medication.model');
const Patient = require('../models/Patient');
const User = require('../models/User');

class MedicationService {
  // Get all medications with optional filters
  async getAllMedications(filters = {}) {
    try {
      const query = {};
      
      if (filters.patient) query.patient = filters.patient;
      if (filters.status) query.status = filters.status;
      if (filters.startDate && filters.endDate) {
        query.startDate = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      const medications = await Medication.find(query)
        .populate('patient', 'name dateOfBirth gender')
        .populate('prescribedBy', 'name department')
        .sort({ startDate: -1 });

      return medications;
    } catch (error) {
      throw new Error(`Error fetching medications: ${error.message}`);
    }
  }

  // Get a single medication by ID
  async getMedicationById(id) {
    try {
      const medication = await Medication.findById(id)
        .populate('patient', 'name dateOfBirth gender phoneNumber address')
        .populate('prescribedBy', 'name department email');

      if (!medication) {
        throw new Error('Medication not found');
      }

      return medication;
    } catch (error) {
      throw new Error(`Error fetching medication: ${error.message}`);
    }
  }

  // Create a new medication
  async createMedication(medicationData, userId) {
    try {
      // Verify patient exists
      const patient = await Patient.findById(medicationData.patient);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Verify prescriber exists and is authorized
      const prescriber = await User.findById(medicationData.prescribedBy);
      if (!prescriber || !['doctor', 'admin'].includes(prescriber.role)) {
        throw new Error('Unauthorized prescriber');
      }

      const medication = new Medication({
        ...medicationData,
        createdBy: userId
      });

      await medication.save();
      return medication;
    } catch (error) {
      throw new Error(`Error creating medication: ${error.message}`);
    }
  }

  // Update a medication
  async updateMedication(id, updateData) {
    try {
      const medication = await Medication.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!medication) {
        throw new Error('Medication not found');
      }

      return medication;
    } catch (error) {
      throw new Error(`Error updating medication: ${error.message}`);
    }
  }

  // Delete a medication
  async deleteMedication(id) {
    try {
      const medication = await Medication.findByIdAndDelete(id);

      if (!medication) {
        throw new Error('Medication not found');
      }

      return { message: 'Medication deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting medication: ${error.message}`);
    }
  }

  // Get medications for a specific patient
  async getPatientMedications(patientId) {
    try {
      const medications = await Medication.find({ patient: patientId })
        .populate('prescribedBy', 'name department')
        .sort({ startDate: -1 });

      return medications;
    } catch (error) {
      throw new Error(`Error fetching patient medications: ${error.message}`);
    }
  }

  // Record medication adherence
  async recordAdherence(id, adherenceData) {
    try {
      const medication = await Medication.findById(id);
      if (!medication) {
        throw new Error('Medication not found');
      }

      const adherence = {
        date: new Date(),
        taken: adherenceData.taken,
        notes: adherenceData.notes
      };

      medication.adherence.push(adherence);
      await medication.save();

      return medication;
    } catch (error) {
      throw new Error(`Error recording adherence: ${error.message}`);
    }
  }

  // Generate adherence report
  async generateAdherenceReport(id) {
    try {
      const medication = await Medication.findById(id);
      if (!medication) {
        throw new Error('Medication not found');
      }

      const report = {
        medication: medication.name,
        patient: medication.patient,
        totalDoses: medication.adherence.length,
        takenDoses: medication.adherence.filter(a => a.taken).length,
        missedDoses: medication.adherence.filter(a => !a.taken).length,
        adherenceRate: medication.adherenceRate,
        adherenceHistory: medication.adherence
      };

      return report;
    } catch (error) {
      throw new Error(`Error generating adherence report: ${error.message}`);
    }
  }

  // Get active medications for a patient
  async getActiveMedications(patientId) {
    try {
      const medications = await Medication.find({
        patient: patientId,
        status: 'active',
        $or: [
          { endDate: { $gt: new Date() } },
          { endDate: null }
        ]
      }).populate('prescribedBy', 'name department');

      return medications;
    } catch (error) {
      throw new Error(`Error fetching active medications: ${error.message}`);
    }
  }
}

module.exports = new MedicationService(); 
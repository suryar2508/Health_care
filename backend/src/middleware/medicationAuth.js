const Medication = require('../models/medication.model');
const User = require('../models/User');

// Middleware to check if user is authorized to access medication
exports.medicationAuth = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Admin can access all medications
    if (user.role === 'admin') {
      req.medication = medication;
      return next();
    }

    // Doctor can access medications they prescribed
    if (user.role === 'doctor' && medication.prescribedBy.toString() === user.id) {
      req.medication = medication;
      return next();
    }

    // Patient can only access their own medications
    if (user.role === 'patient' && medication.patient.toString() === user.id) {
      req.medication = medication;
      return next();
    }

    // Caregiver can access medications of their assigned patients
    if (user.role === 'caregiver') {
      const hasAccess = await User.findOne({
        _id: user.id,
        'assignedPatients': medication.patient
      });

      if (hasAccess) {
        req.medication = medication;
        return next();
      }
    }

    res.status(403).json({ message: 'Unauthorized access to medication' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to check if user can prescribe medications
exports.canPrescribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role === 'admin' || user.role === 'doctor') {
      return next();
    }

    res.status(403).json({ message: 'Unauthorized to prescribe medications' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to check if user can record adherence
exports.canRecordAdherence = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Admin and doctors can record adherence
    if (user.role === 'admin' || user.role === 'doctor') {
      return next();
    }

    // Patient can record adherence for their own medications
    if (user.role === 'patient' && medication.patient.toString() === user.id) {
      return next();
    }

    // Caregiver can record adherence for their assigned patients
    if (user.role === 'caregiver') {
      const hasAccess = await User.findOne({
        _id: user.id,
        'assignedPatients': medication.patient
      });

      if (hasAccess) {
        return next();
      }
    }

    res.status(403).json({ message: 'Unauthorized to record medication adherence' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
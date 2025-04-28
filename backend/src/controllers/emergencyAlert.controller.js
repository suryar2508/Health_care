const EmergencyAlert = require('../models/EmergencyAlert');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const { patient, type, status, startDate, endDate } = req.query;
    
    // Build query based on filters
    const query = {};
    
    if (patient) query.patient = patient;
    if (type) query.type = type;
    if (status) query.status = status;
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const alerts = await EmergencyAlert.find(query)
      .populate('patient', 'name dateOfBirth gender')
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single alert
exports.getAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id)
      .populate('patient', 'name dateOfBirth gender phoneNumber address')
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .populate('actions.takenBy', 'name');
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create alert
exports.createAlert = async (req, res) => {
  try {
    // Check if patient exists
    const patient = await Patient.findById(req.body.patient);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Create alert
    const alert = new EmergencyAlert(req.body);
    const savedAlert = await alert.save();
    
    // Notify relevant staff based on alert type
    await notifyStaff(savedAlert);
    
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update alert
exports.updateAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Acknowledge alert
exports.acknowledgeAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, notes } = req.body;
    
    // Check if user exists and is authorized
    const user = await User.findById(userId);
    if (!user || !['doctor', 'nurse', 'admin'].includes(user.role)) {
      return res.status(404).json({ message: 'Authorized user not found' });
    }
    
    const alert = await EmergencyAlert.findById(id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Update alert status
    alert.status = 'Acknowledged';
    alert.acknowledgedBy = userId;
    
    // Add action record
    alert.actions.push({
      takenBy: userId,
      action: 'Acknowledged',
      notes
    });
    
    await alert.save();
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, resolution, notes } = req.body;
    
    // Check if user exists and is authorized
    const user = await User.findById(userId);
    if (!user || !['doctor', 'nurse', 'admin'].includes(user.role)) {
      return res.status(404).json({ message: 'Authorized user not found' });
    }
    
    const alert = await EmergencyAlert.findById(id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Update alert status
    alert.status = 'Resolved';
    alert.resolvedBy = userId;
    alert.resolvedAt = new Date();
    
    // Add action record
    alert.actions.push({
      takenBy: userId,
      action: 'Resolved',
      notes: `${resolution}. ${notes || ''}`
    });
    
    await alert.save();
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add action to alert
exports.addAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, action, notes } = req.body;
    
    // Check if user exists and is authorized
    const user = await User.findById(userId);
    if (!user || !['doctor', 'nurse', 'admin'].includes(user.role)) {
      return res.status(404).json({ message: 'Authorized user not found' });
    }
    
    const alert = await EmergencyAlert.findById(id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Add action record
    alert.actions.push({
      takenBy: userId,
      action,
      notes
    });
    
    await alert.save();
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get patient's alerts
exports.getPatientAlerts = async (req, res) => {
  try {
    const { patientId, status } = req.params;
    
    const query = { patient: patientId };
    if (status) query.status = status;
    
    const alerts = await EmergencyAlert.find(query)
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to notify staff
async function notifyStaff(alert) {
  try {
    // Find staff members based on alert type and department
    const staffQuery = { role: { $in: ['doctor', 'nurse', 'admin'] } };
    
    // For critical alerts, notify all staff
    if (alert.type === 'Critical') {
      const staff = await User.find(staffQuery);
      
      // Add notification records
      const notifications = staff.map(user => ({
        recipient: user._id,
        method: 'In-app' // In a real app, you would implement email/SMS notifications
      }));
      
      alert.notifications = notifications;
      await alert.save();
    } 
    // For other alerts, notify based on department or role
    else {
      // This is a simplified example - in a real app, you would have more complex notification logic
      const staff = await User.find(staffQuery).limit(3);
      
      const notifications = staff.map(user => ({
        recipient: user._id,
        method: 'In-app'
      }));
      
      alert.notifications = notifications;
      await alert.save();
    }
    
    // In a real application, you would implement actual notification sending here
    // e.g., sending emails, SMS, push notifications, etc.
    
    return true;
  } catch (error) {
    console.error('Error notifying staff:', error);
    return false;
  }
} 
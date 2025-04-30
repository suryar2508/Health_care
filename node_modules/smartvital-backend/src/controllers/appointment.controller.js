const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { startDate, endDate, doctor, patient, status } = req.query;
    
    // Build query based on filters
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (doctor) query.doctor = doctor;
    if (patient) query.patient = patient;
    if (status) query.status = status;
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name dateOfBirth gender')
      .populate('doctor', 'name department')
      .sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name dateOfBirth gender phoneNumber address')
      .populate('doctor', 'name department email');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    // Check if patient exists
    const patient = await Patient.findById(req.body.patient);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check if doctor exists
    const doctor = await User.findById(req.body.doctor);
    if (!doctor || !['doctor', 'admin'].includes(doctor.role)) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Check for scheduling conflicts
    const { date, time, duration } = req.body;
    const appointmentDate = new Date(date);
    const appointmentTime = time;
    
    // Find overlapping appointments
    const overlappingAppointments = await Appointment.find({
      doctor: req.body.doctor,
      date: appointmentDate,
      status: { $nin: ['Cancelled', 'No-show'] },
      $or: [
        // Appointment starts during another appointment
        {
          time: { $lte: appointmentTime },
          $expr: {
            $gt: {
              $add: [
                { $toInt: { $substr: ["$time", 0, 2] } },
                { $divide: [{ $toInt: { $substr: ["$time", 3, 2] } }, 60] }
              ]
            },
            {
              $add: [
                { $toInt: { $substr: [appointmentTime, 0, 2] } },
                { $divide: [{ $toInt: { $substr: [appointmentTime, 3, 2] } }, 60] }
              ]
            }
          }
        },
        // Appointment ends during another appointment
        {
          $expr: {
            $lt: {
              $add: [
                { $toInt: { $substr: ["$time", 0, 2] } },
                { $divide: [{ $toInt: { $substr: ["$time", 3, 2] } }, 60] },
                { $divide: ["$duration", 60] }
              ]
            },
            {
              $add: [
                { $toInt: { $substr: [appointmentTime, 0, 2] } },
                { $divide: [{ $toInt: { $substr: [appointmentTime, 3, 2] } }, 60] },
                { $divide: [duration, 60] }
              ]
            }
          }
        }
      ]
    });
    
    if (overlappingAppointments.length > 0) {
      return res.status(400).json({ 
        message: 'Scheduling conflict: Doctor has another appointment at this time',
        conflictingAppointments: overlappingAppointments
      });
    }
    
    // Create appointment
    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    
    // Update patient's appointments array
    await Patient.findByIdAndUpdate(
      req.body.patient,
      { $push: { appointments: savedAppointment._id } }
    );
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Remove appointment from patient's appointments array
    await Patient.findByIdAndUpdate(
      appointment.patient,
      { $pull: { appointments: appointment._id } }
    );
    
    await appointment.remove();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get doctor's schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.params;
    
    const query = { doctor: doctorId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name')
      .sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient's appointments
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const appointments = await Appointment.find({ patient: patientId })
      .populate('doctor', 'name department')
      .sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
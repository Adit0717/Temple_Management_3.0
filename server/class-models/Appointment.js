const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  empId: {type: String},
  email: { type: String},
  priest: { type: String},
  priestId: String,
  phone: String,
  date: Date,
  title: String,
  firstName: String,
  address: String,
  status: String 
});

module.exports = mongoose.model('Appointment', appointmentSchema);
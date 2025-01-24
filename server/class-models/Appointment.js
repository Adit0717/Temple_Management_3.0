const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userName: {type: String},
  priestId: { type: String, required: true },
  priest: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  information: { type: String },
  email: { type: String },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    allDay: { type: Boolean, default: true },
  });

module.exports = mongoose.model('Event', eventSchema);
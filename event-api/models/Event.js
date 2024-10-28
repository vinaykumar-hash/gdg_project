const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  dateTime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Event', eventSchema);

const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true }, // include country code e.g. +91xxxxxxxxxx
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);

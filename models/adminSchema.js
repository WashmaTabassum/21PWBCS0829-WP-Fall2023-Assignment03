const mongoose = require('mongoose');

// Define Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

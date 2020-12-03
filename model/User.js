const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  org: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  inn: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  kpp: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  ogrn: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  ua: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  phone: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('User', userSchema);
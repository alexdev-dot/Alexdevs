const mongoose = require('mongoose');

const SecretSchema = new mongoose.Schema({
  keyId: { type: String, required: true, unique: true },
  secret: { type: String, required: true },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Secret', SecretSchema);

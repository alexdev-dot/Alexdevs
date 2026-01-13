const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  subscribedAt: { type: Date, default: Date.now },
  ip: { type: String },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);

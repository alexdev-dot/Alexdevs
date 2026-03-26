const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Middleware to verify Admin JWT
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// @route   POST api/contact
// @desc    Submit a contact form message
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = await Contact.create({ name, email, message });

    // Emit a socket event so connected admin dashboards can receive the message in real-time
    try {
      const io = req.app && req.app.get && req.app.get("io");
      if (io) io.emit("contact:new", newContact);
    } catch (e) {
      console.warn("Failed to emit contact:new", e.message);
    }

    // Return the saved contact so clients can use the createdAt timestamp immediately
    res.json(newContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/contact
// @desc    Get all messages
// @access  Private (Admin)
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/contact/:id/read
// @desc    Mark message as read/unread
// @access  Private (Admin)
router.put("/:id/read", auth, async (req, res) => {
  try {
    const message = await Contact.findByPk(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message not found" });

    message.read = !message.read; // toggle
    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/contact/:id
// @desc    Delete a message
// @access  Private (Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Contact.findByPk(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message not found" });

    await message.destroy();
    res.json({ msg: "Message removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/contact/reply
// @desc    Reply to a message via Email
// @access  Private (Admin)
router.post("/reply", auth, async (req, res) => {
  const { id, email, subject, replyMessage } = req.body;

  try {
    // 1. Setup Nodemailer Transporter
    // NOTE: You need to add EMAIL_USER and EMAIL_PASS to backend/.env
    // For Gmail, use App Password if 2FA is on.
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your provider
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD, // Requires App Password for Gmail
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: subject || "Reply from AlexDevs",
      text: replyMessage,
    };

    // 2. Send Email
    await transporter.sendMail(mailOptions);

    // 3. Mark as Replied in DB
    const contact = await Contact.findByPk(id);
    if (contact) {
      contact.replied = true;
      contact.read = true; // Auto mark read if replied
      await contact.save();
    }

    res.json({ msg: "Reply sent successfully" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ msg: "Failed to send email. Check server logs." });
  }
});

module.exports = router;

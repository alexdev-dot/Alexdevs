const express = require("express");
const router = express.Router();

// Persist subscribers in MongoDB via Mongoose model
const Subscriber = require("../models/Subscriber");
// In-memory variable remains for backwards-compatibility during migration
let newsletterSubscribers = []; // (unused now)

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Normalize email (lowercase)
    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate email in DB
    const existingSubscriber = await Subscriber.findOne({
      where: { email: normalizedEmail },
    });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed to our newsletter",
      });
    }

    // Add new subscriber to DB
    const saved = await Subscriber.create({
      email: normalizedEmail,
      ip: req.ip || req.connection.remoteAddress,
    });

    console.log(`📧 New newsletter subscriber: ${normalizedEmail}`);

    // Emit socket event if Socket.IO is attached to app
    try {
      const io = req.app && req.app.get && req.app.get("io");
      if (io) io.emit("newsletter:new", saved);
    } catch (e) {
      console.warn("Socket emit failed:", e.message);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: {
        id: saved.id,
        email: saved.email,
        subscribedAt: saved.subscribedAt,
      },
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// GET /api/newsletter/subscribers (Admin endpoint - protected in production)
router.get("/subscribers", async (req, res) => {
  try {
    const subs = await Subscriber.findAll({
      order: [['subscribedAt', 'DESC']],
      attributes: ['id', 'email', 'subscribedAt', 'read']
    });
    res.status(200).json({
      success: true,
      message: "Subscribers retrieved successfully",
      data: {
        subscribers: subs,
        total: subs.length,
      },
    });
  } catch (error) {
    console.error("Error retrieving subscribers:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// DELETE /api/newsletter/unsubscribe
router.delete("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const deleted = await Subscriber.destroy({
      where: { email: normalizedEmail },
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found in subscription list",
      });
    }

    console.log(`📧 Unsubscribed: ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Toggle read/unread for a subscriber (Admin)
router.put("/subscribers/:id/read", async (req, res) => {
  try {
    const sub = await Subscriber.findByPk(req.params.id);
    if (!sub)
      return res
        .status(404)
        .json({ success: false, message: "Subscriber not found" });
    sub.read = !sub.read;
    await sub.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Toggled read",
        data: { id: sub.id, read: sub.read },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;

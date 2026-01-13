const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Simple in-memory rate limiting for admin login
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// @route   POST api/admin/login
// @desc    Admin Login with Security Enhancements
// @access  Public
router.post('/login', (req, res) => {
  const { email, password, secretKey } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  // 1. Check Rate Limiting
  const now = Date.now();
  if (loginAttempts.has(ip)) {
    const { count, lastAttempt } = loginAttempts.get(ip);
    if (count >= MAX_ATTEMPTS && now - lastAttempt < LOCK_TIME) {
      const remainingTime = Math.ceil((LOCK_TIME - (now - lastAttempt)) / 60000);
      return res.status(429).json({ 
        msg: `Security Lockout: Too many failed attempts. Try again in ${remainingTime} minutes.` 
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const hashedPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminSecretKey = process.env.ADMIN_SECRET_KEY?.trim();

  // 2. Validate Credentials
  const isEmailMatch = email?.trim() === adminEmail;
  const isSecretKeyMatch = secretKey?.trim() === adminSecretKey;
  
  // Use bcrypt for password and handle potential plaintext if not hashed yet (though we recommend hashing)
  let isPasswordMatch = false;
  try {
    if (hashedPassword && hashedPassword.startsWith('$2b$')) {
      isPasswordMatch = bcrypt.compareSync(password, hashedPassword);
    } else {
      // Fallback to direct comparison if NOT yet hashed (for initial setup)
      isPasswordMatch = password === hashedPassword;
    }
  } catch (err) {
    isPasswordMatch = false;
  }

  if (isEmailMatch && isPasswordMatch && isSecretKeyMatch) {
    // SUCCESS
    loginAttempts.delete(ip); // Reset attempts on success
    const payload = { admin: true };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    // FAILURE
    const current = loginAttempts.get(ip) || { count: 0 };
    loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now });

    res.status(401).json({ msg: 'Access Denied: Invalid Credentials' });
  }
});

// @route   POST api/admin/refresh
// @desc    Refresh Admin Token
// @access  Public (needs valid token)
router.post('/refresh', (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    // Verify existing token (must be valid and not expired yet to be refreshed this way)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Issue new token
    const payload = { admin: true };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

module.exports = router;

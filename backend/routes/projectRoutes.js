const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

// Middleware to verify Admin JWT
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png|gif|webp/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
          return cb(null, true);
      } else {
          cb('Error: Images Only!');
      }
  }
});

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Add a project
// @access  Private (Admin)
router.post('/', [auth, upload.single('image')], async (req, res) => {
  const { title, description, link, tech } = req.body;
  
  // If no file is uploaded, we can either throw error or allow URL (if sent in body, but logic below assumes file for 'image')
  // Let's assume user MUST upload file or provide fallback URL (if handled in frontend)
  // For now, prioritize file upload.
  let imagePath = '';
  if (req.file) {
    // Construct URL path (e.g., http://localhost:5000/uploads/filename.jpg)
    // We'll store relatively or absolute. Relatively 'uploads/filename.jpg' is easier, 
    // frontend can prepend server URL.
    imagePath = `http://localhost:5000/uploads/${req.file.filename}`;
  } else if (req.body.image) {
    // Fallback to URL if provided in text field (for backward compat or external links)
    imagePath = req.body.image;
  }

  try {
    const newProject = new Project({ 
      title, 
      description, 
      image: imagePath, 
      link, 
      tech: tech ? tech.split(',').map(t => t.trim()) : [] // Handle tech as string from FormData
    });
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private (Admin)
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
  const { title, description, link, tech, existingImage } = req.body;
  
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project.title = title || project.title;
    project.description = description || project.description;
    project.link = link || project.link;
    
    // Tech comes as string in FormData, need to parse if updated
    if (tech) {
       project.tech = tech.split(',').map(t => t.trim());
    }

    if (req.file) {
      project.image = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (existingImage) {
       // If user didn't upload new file but kept old one (or pasted new URL)
       // usually we just don't touch it if undefined, but if passed explicitly:
       project.image = existingImage || project.image;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/auth");
const Room = require("../models/Room");
const Plant = require("../models/Plant");

// Constants
const JWT_SECRET = process.env.JWT_SECRET || "randomString";
const JWT_EXPIRES_IN = "2days";
const UPLOAD_LIMITS = {
  IMAGE_SIZE: 1000000, // 1MB
  MODEL_SIZE: 100000000, // 100MB
};

// Validation schemas
const signupValidation = [
  check("username", "Please Enter a Valid Username").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({ min: 6 }),
];

const loginValidation = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({ min: 6 }),
];

// Multer configurations
const createStorage = (destination) => multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const imageUpload = multer({
  storage: createStorage("images"),
  limits: { fileSize: UPLOAD_LIMITS.IMAGE_SIZE },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/i)) {
      return cb(new Error("Please upload a valid image (PNG, JPG, JPEG)"));
    }
    cb(undefined, true);
  },
});

const modelUpload = multer({
  storage: createStorage("modelsPytorch"),
  limits: { fileSize: UPLOAD_LIMITS.MODEL_SIZE },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pt|ptl|pth)$/i)) {
      return cb(new Error("Please upload a valid model file (PT, PTL, PTH)"));
    }
    cb(undefined, true);
  },
});

// Helper functions
const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== FILE UPLOAD ROUTES ====================

/**
 * @route   POST /uploadImage
 * @desc    Upload single image file
 * @access  Public
 */
router.post("/uploadImage", imageUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({ filename: req.file.filename });
}, (error, req, res, next) => {
  res.status(400).json({ error: error.message });
});

/**
 * @route   POST /uploadModel
 * @desc    Upload single model file
 * @access  Public
 */
router.post("/uploadModel", modelUpload.single("model"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({ filename: req.file.filename });
}, (error, req, res, next) => {
  res.status(400).json({ error: error.message });
});

/**
 * @route   DELETE /deleteImage
 * @desc    Delete image file
 * @access  Public
 */
router.delete("/deleteImage", asyncHandler(async (req, res) => {
  const { filename } = req.body;
  
  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  try {
    await fs.unlink(path.join(__dirname, "../images/", filename));
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: "File not found" });
    }
    throw error;
  }
}));

/**
 * @route   DELETE /deleteModel
 * @desc    Delete model file
 * @access  Public
 */
router.delete("/deleteModel", asyncHandler(async (req, res) => {
  const { filename } = req.body;
  
  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  try {
    await fs.unlink(path.join(__dirname, "../modelsPytorch/", filename));
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: "File not found" });
    }
    throw error;
  }
}));

// ==================== AUTHENTICATION ROUTES ====================

/**
 * @route   POST /signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", signupValidation, asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  // Generate token
  const token = await generateToken(user);
  res.status(201).json({ token });
}));

/**
 * @route   POST /login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post("/login", loginValidation, asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate token
  const token = await generateToken(user);
  res.status(200).json({ token });
}));

/**
 * @route   GET /me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}));

// ==================== ROOM MANAGEMENT ROUTES ====================

/**
 * @route   POST /createRoom
 * @desc    Create a new room
 * @access  Public
 */
router.post("/createRoom", asyncHandler(async (req, res) => {
  const { nameRoom, idUser, imageRoom, floor } = req.body;

  // Validate required fields
  if (!nameRoom || !idUser) {
    return res.status(400).json({ 
      error: "Room name and user ID are required" 
    });
  }

  const room = new Room({
    nameRoom,
    idUser,
    imageRoom,
    floor,
  });

  await room.save();
  res.status(201).json({ 
    message: "Room created successfully",
    room: room 
  });
}));

/**
 * @route   GET /getRoom
 * @desc    Get all rooms
 * @access  Private
 */
router.get("/getRoom", auth, asyncHandler(async (req, res) => {
  const rooms = await Room.find().populate('idUser', 'username email');
  res.json(rooms);
}));

// ==================== PLANT MANAGEMENT ROUTES ====================

/**
 * @route   POST /createPlant
 * @desc    Create a new plant
 * @access  Public
 */
router.post("/createPlant", asyncHandler(async (req, res) => {
  const { namePlant, nameRoom, healthStatus, userID, imagePlant } = req.body;

  // Validate required fields
  if (!namePlant || !nameRoom || !userID) {
    return res.status(400).json({ 
      error: "Plant name, room name, and user ID are required" 
    });
  }

  const plant = new Plant({
    namePlant,
    nameRoom,
    healthStatus,
    userID,
    imagePlant,
  });

  await plant.save();
  res.status(201).json({ 
    message: "Plant created successfully",
    plant: plant 
  });
}));

/**
 * @route   GET /getPlant
 * @desc    Get all plants
 * @access  Private
 */
router.get("/getPlant", auth, asyncHandler(async (req, res) => {
  const plants = await Plant.find().populate('userID', 'username email');
  res.json(plants);
}));

/**
 * @route   DELETE /deletePlant/:id
 * @desc    Delete a plant
 * @access  Private
 */
router.delete("/deletePlant/:id", auth, asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  
  if (!plant) {
    return res.status(404).json({ error: "Plant not found" });
  }

  // If plant has an image, delete it from filesystem
  if (plant.imagePlant) {
    try {
      await fs.unlink(path.join(__dirname, "../images/", plant.imagePlant));
    } catch (error) {
      console.warn("Failed to delete plant image:", error.message);
    }
  }

  res.status(200).json({ message: "Plant deleted successfully" });
}));

/**
 * @route   PUT /updatePlant/:id
 * @desc    Update a plant
 * @access  Private
 */
router.put("/updatePlant/:id", auth, asyncHandler(async (req, res) => {
  const { namePlant, nameRoom, healthStatus, userID, imagePlant } = req.body;
  
  const plant = await Plant.findByIdAndUpdate(
    req.params.id,
    { namePlant, nameRoom, healthStatus, userID, imagePlant },
    { new: true, runValidators: true }
  );

  if (!plant) {
    return res.status(404).json({ error: "Plant not found" });
  }

  res.status(200).json({ 
    message: "Plant updated successfully",
    plant 
  });
}));

/**
 * @route   DELETE /deleteRoom/:id
 * @desc    Delete a room
 * @access  Private
 */
router.delete("/deleteRoom/:id", auth, asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  // Also delete associated plants
  await Plant.deleteMany({ nameRoom: room.nameRoom });

  res.status(200).json({ message: "Room and associated plants deleted successfully" });
}));

/**
 * @route   PUT /updateRoom/:id
 * @desc    Update a room
 * @access  Public
 */
router.put("/updateRoom/:id", asyncHandler(async (req, res) => {
  const { nameRoom, idUser, imageRoom, floor } = req.body;
  
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    { nameRoom, idUser, imageRoom, floor },
    { new: true, runValidators: true }
  );

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.status(200).json({ 
    message: "Room updated successfully",
    room 
  });
}));

// ==================== ERROR HANDLING MIDDLEWARE ====================

/**
 * Global error handler for this router
 */
router.use((error, req, res, next) => {
  console.error('Router Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;

const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/auth");
const Room = require("../models/Room");
const Plant = require("../models/Plant");
const { ok } = require("assert");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

const storage = multer.diskStorage({
  // Destination to store image
  destination: "images",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const storageModel = multer.diskStorage({
  // Destination to store image
  destination: "modelsPytorch",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

const modelUpload = multer({
  storage: storageModel,
  limits: {
    fileSize: 100000000, // 100000000 Bytes = 100 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pt|plt|pth)$/)) {
      // upload only glb and gltf format
      return cb(new Error("Please upload a Model"));
    }
    cb(undefined, true);
  },
});

// For Single image upload
router.post(
  "/uploadImage",
  imageUpload.single("image"),
  (req, res) => {
    res.status(200).send({
      msg: req.file.filename,
    });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post(
  "/uploadModel",
  modelUpload.single("model"),
  (req, res) => {
    res.status(200).send({
      msg: req.file.filename,
    });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/deleteImage", (req, res) => {
  const { filename } = req.body;
  fs.unlink(path.join(__dirname, "../images/" + filename), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    res.status(200).send({
      msg: "File deleted successfully",
    });
  });
});

router.delete("/deleteModel", (req, res) => {
  const { filename } = req.body;
  fs.unlink(path.join(__dirname, "../modelsPytorch/" + filename), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    res.status(200).send({
      msg: "File deleted successfully",
    });
  });
});

router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: "2days",
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: "2days",
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

//post information room for user by userID
router.post("/createRoom", async (req, res) => {
  try {
    const { nameRoom, idUser, imageRoom, floor } = req.body;
    const room = new Room({
      nameRoom,
      idUser,
      imageRoom,
      floor,
    });
    await room.save();
    return res.status(200).json({
      msg: "Room created",
    });
  } catch (e) {
    res.send({ message: "Error in Fetching room" });
  }
});

router.get("/getRoom", auth, async (req, res) => {
  try {
    const room = await Room.find();
    res.json(room);
  } catch (e) {
    res.send({ message: "Error in Fetching room" });
  }
});

router.post("/createPlant", async (req, res) => {
  try {
    const { namePlant, nameRoom, healthStatus, userID, imagePlant } = req.body;
    const plant = new Plant({
      namePlant,
      nameRoom,
      healthStatus,
      userID,
      imagePlant,
    });
    await plant.save();
    return res.status(200).json({
      msg: "Plant created",
    });
  } catch (e) {
    res.send({ message: "Error in Fetching plant" });
  }
});

router.get("/getPlant", auth, async (req, res) => {
  try {
    const plant = await Plant.find();
    res.json(plant);
  } catch (e) {
    res.send({ message: "Error in Fetching plant" });
  }
});

router.delete("/deletePlant/:id", auth, async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    // const img = plant.imagePlant;
    // fs.unlinkSync(images/img)
    return res.status(200).json({
      msg: "Delete plant",
    });
  } catch (e) {
    res.send({ message: "Error in Fetching plant" });
  }
});

router.put("/updatePlant/:id", auth, async (req, res) => {
  try {
    const { namePlant, nameRoom, healthStatus, userID } = req.body;
    const plant = await Plant.findByIdAndUpdate(req.params.id, {
      namePlant,
      nameRoom,
      healthStatus,
      userID,
    });
    return res.status(200).json({
      msg: "Update plant",
    });
  } catch (e) {
    res.send({ message: "Error in Fetching plant" });
  }
});

router.delete("/deleteRoom/:id", auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      msg: "Delete room",
    });
  } catch (e) {
    res.send({ message: "Error in Fetching room" });
  }
});

router.put("/updateRoom/:id", async (req, res) => {
  try {
    const { nameRoom, idUser } = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, {
      nameRoom,
      idUser,
    });
    return res.status(200).json({
      msg: "Update room",
    });
  } catch (e) {
    res.send({ message: "Error in Fetching room" });
  }
});

module.exports = router;

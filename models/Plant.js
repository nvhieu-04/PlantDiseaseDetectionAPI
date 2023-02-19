const mongoose = require("mongoose");
const { uuid } = require("uuidv4");

const PlantSchema = mongoose.Schema({
  namePlant: {
    type: String,
    required: true,
  },
  nameRoom: {
    type: String,
    required: true,
  },
  healthStatus: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: uuid,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  imagePlant: {
    type: String,
    required: true,
  },
});

// export model user with UserSchema
module.exports = mongoose.model("plant", PlantSchema);

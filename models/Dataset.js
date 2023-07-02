const mongoose = require("mongoose");
const { uuid } = require("uuidv4");

const DatasetSchema = mongoose.Schema({
  nameDataset: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// export model user with UserSchema
module.exports = mongoose.model("dataset", DatasetSchema);

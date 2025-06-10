const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase"; // Replace with your MongoDB URI

const InitiateMongoServer = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;

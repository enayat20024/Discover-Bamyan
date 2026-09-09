const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    const con = await mongoose.connect(MONGO_URL);
    console.log(`MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;

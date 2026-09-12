const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined");
    }

    console.log("Connecting to MongoDB...");

    const con = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB connected: ${con.connection.host}`);

    return con;
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    throw error;
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: null,
  },
  email: {
    type: String,
  },
  pickup: {
    type: String,
  },
  dropoff: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  passengers: {
    type: Number,
  },
  vehicleId: {
    type: String,
  },

  vehicleName: {
    type: String,
  },

  pricePerPassenger: {
    type: Number,
  },

  totalPrice: {
    type: Number,
  },
  status: {
    type: String,
    default: "Confirmed",
  },
});

const Transport = mongoose.model("Transport", transportSchema);

module.exports = Transport;

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  hotelName: {
    type: String,
  },
  price: {
    type: Number,
  },
  email: {
    type: String,
  },
  status: {
    type: String,
    default: "Confirmed",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: null,
  },
  checkIn: { type: Date },
  checkOut: { type: Date },
  adult: { type: Number },
  child: { type: Number },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

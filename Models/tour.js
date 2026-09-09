const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  languages: [String],

  experience: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: true,
  },

  specialty: {
    type: String,
    required: true,
  },
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;

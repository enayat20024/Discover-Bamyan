const Booking = require("../Models/booking");

const createBooking = async (req, res) => {
  try {
    const { name, email, checkIn, checkOut, adult, child, hotelTitle, price } =
      req.body;
    if (!name || !email || !checkIn || !checkOut || !adult || !child) {
      return res.status(500).send({
        success: false,
        message: `${req.user.userName} please provide all fields`,
      });
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "check-out date must be after chek-in date",
      });
    }
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * price;
    const booking = await Booking.create({
      name,
      email,
      user: req.user._id,
      checkIn: start,
      checkOut: end,
      child,
      adult,
      hotelName: hotelTitle,
      price: totalPrice,
    });
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Booking API Error",
    });
  }
};

const getMyBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Deleting the booking via admin

const deleteBookingByAdmin = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        succeess: false,
        message: "Booking Not Found",
      });
    }

    await Booking.findByIdAndDelete(bookingId);
    return res.status(200).json({
      success: true,
      message: "Booking has been deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Cancelled",
      booking,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error cancelling Booking",
    });
  }
};

module.exports = {
  createBooking,
  getMyBooking,
  cancelBooking,
  getAllBookings,
  deleteBookingByAdmin,
};

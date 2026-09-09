const Transport = require("../Models/transport");

const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      pickup,
      dropoff,
      date,
      time,
      passengers,
      vehicleId,
      vehicleName,
      pricePerPassenger,
      totalPrice,
    } = req.body;
    if (
      !name ||
      !email ||
      !pickup ||
      !dropoff ||
      !date ||
      !time ||
      !passengers
    ) {
      return res.status(500).send({
        success: false,
        message: `${req.user.userName} please provide all fields`,
      });
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Date must be today or in the future",
      });
    }
    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    if (isToday) {
      const [hours, minutes] = time.split(":").map(Number);
      const selectedDateTime = new Date();
      selectedDateTime.setHours(hours, minutes, 0, 0);
      if (selectedDateTime < today) {
        return res.status(400).json({
          success: false,
          message: "Past time is not allowed for today's date",
        });
      }
    }
    const booking = await Transport.create({
      name,
      email,
      pickup,
      dropoff,
      date,
      time,
      passengers,
      vehicleId,
      vehicleName,
      pricePerPassenger,
      totalPrice,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Transport booking created successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Transport Booking API Error",
    });
  }
};

const getMyTrasnport = async (req, res) => {
  try {
    const transports = await Transport.find({
      user: req.user._id,
    });
    res.status(200).json({
      success: true,
      transports,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const cancelTransport = async (req, res) => {
  const transportId = req.params.id;
  try {
    const transport = await Transport.findById(transportId);
    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "Transport Booking Not Found",
      });
    }
    transport.status = "Cancelled";
    await transport.save();

    res.status(200).json({
      success: true,
      message: "Transport Booking Cancelled",
      transport,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error cancelling Transport Booking",
    });
  }
};

// get all transport for admin page

const getAllTransportBookings = async (req, res) => {
  try {
    const transports = await Transport.find();
    res.status(200).json({
      success: true,
      transports,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// deleting trasnport booking via Admin

const deleteTransportByAdmin = async (req, res) => {
  try {
    const transportId = req.params.id;
    const transport = await Transport.findById(transportId);
    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "Transport Booking Not Found",
      });
    }
    await Transport.findByIdAndDelete(transportId);
    return res.status(200).json({
      success: true,
      message: "Trasnport booking has been deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createBooking,
  getMyTrasnport,
  cancelTransport,
  getAllTransportBookings,
  deleteTransportByAdmin,
};

const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middleware/authorization");
const {
  createBooking,
  getMyBooking,
  cancelBooking,
  getAllBookings,
  deleteBookingByAdmin,
} = require("../controllers/bookingControll");
router.get("/bookings", isAuthenticated, getAllBookings);
router.post("/create-booking", isAuthenticated, createBooking);
router.get("/my-booking", isAuthenticated, getMyBooking);
router.put("/cancel-booking/:id", isAuthenticated, cancelBooking);
router.delete("/delete-booking/:id", isAuthenticated, deleteBookingByAdmin);

module.exports = router;

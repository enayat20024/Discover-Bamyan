const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middleware/authorization");
const {
  createBooking,
  getMyTrasnport,
  cancelTransport,
  getAllTransportBookings,
  deleteTransportByAdmin,
} = require("../controllers/transportController");
router.post("/create-booking", isAuthenticated, createBooking);
router.get("/my-transport", isAuthenticated, getMyTrasnport);
router.get("/transports", isAuthenticated, getAllTransportBookings);
router.put("/cancel-transport/:id", isAuthenticated, cancelTransport);
router.delete("/delete-transport/:id", isAuthenticated, deleteTransportByAdmin);

module.exports = router;

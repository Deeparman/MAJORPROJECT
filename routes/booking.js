const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

router.post('/listings/:id/book', isLoggedIn, bookingController.book); 
router.get('/bookings', isLoggedIn, bookingController.booking);
router.delete('/bookings/:id', isLoggedIn, bookingController.cancelBook);

module.exports = router;
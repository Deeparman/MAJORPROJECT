const express = require("express");
const router = express.Router();

const ownerController = require("../controllers/owner");
const { isLoggedIn, isHotelOwner } = require("../middleware");


router.get("/", isLoggedIn, isHotelOwner, ownerController.dashboard);
router.get("/my-listings", isLoggedIn, isHotelOwner, ownerController.getOwnerListings);
router.get("/bookings", isLoggedIn, isHotelOwner, ownerController.getOwnerBookings);


module.exports = router;
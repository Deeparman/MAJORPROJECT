const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const { isLoggedIn, isAdmin } = require("../middleware");
const User = require("../models/user");
const Booking = require("../models/booking");
const Review = require("../models/review");

// Admin dashboard
router.get("/", isLoggedIn, isAdmin, async (req, res) => {
    const users = await require("../models/user").find({});
    const listings = await Listing.find({});
    const reviews = await Review.find({});
    const bookings = await Booking.find({});
    
    res.render("admin/dashboard.ejs", { users, listings, reviews, bookings });
});


router.patch("/make-owner/:id", isLoggedIn, isAdmin, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        role: "hotelOwner"
    });

    req.flash("success", "User promoted to Hotel Owner");
    res.redirect("/admin");
});


router.patch("/make-admin/:id", isLoggedIn, isAdmin, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        role: "admin"
    });

    req.flash("success", "User promoted to Admin");
    res.redirect("/admin");
});


router.patch("/make-user/:id", isLoggedIn, isAdmin, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        role: "user"
    });

    req.flash("success", "User role reset to User");
    res.redirect("/admin");
});

router.patch("/listings/:id/approve", isLoggedIn, isAdmin, async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, { status: "approved" });
    req.flash("success", "Listing approved!");
    res.redirect("/admin");
});

router.get("/approvals", isLoggedIn, isAdmin, async(req,res)=>{
    
    const pendingListings = await Listing.find({
        status:"pending"
    }).populate("owner");

    res.render("admin/approval",{
        pendingListings
    });
});

router.get("/all-bookings", isLoggedIn, isAdmin, async(req,res)=>{

    const bookings = await Booking.find({})
        .populate("user")
        .populate("listing");

    res.render("admin/booking",{
        bookings
    });
});

router.get("/all-users", isLoggedIn, isAdmin, async(req,res)=>{
    const users = await User.find({});
    const listings = await Listing.find({});
    res.render("admin/users",{
        users , listings
    });
});

router.get("/reviews", isLoggedIn, isAdmin, async(req,res)=>{
    const reviews = await Review.find({})
        .populate("author")
        .populate("listing");

    res.render("admin/reviews", {
        reviews
    });
});

router.get("/manage-listings", isLoggedIn, isAdmin, async (req, res) => {

    const listings = await Listing.find({})
        .populate("owner");

    res.render("admin/listings", {
        listings
    });

});

module.exports = router;

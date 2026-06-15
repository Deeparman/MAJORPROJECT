const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.book = async (req, res) => {
    try {
        const listingId = req.params.id;
        const { checkIn, checkOut, guests, roomsBooked } = req.body;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const requestedRooms = Number(roomsBooked ?? 1);
        const requestedGuests = Number(guests);

        if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
            req.flash("error", "Invalid check-in/check-out date");
            return res.redirect(`/listings/${listingId}`);
        }

        // Date validation
        if (checkOutDate <= checkInDate) {
            req.flash("error", "Check-out date must be after check-in date");
            return res.redirect(`/listings/${listingId}`);
        }

        if (!Number.isFinite(requestedRooms) || requestedRooms <= 0) {
            req.flash("error", "roomsBooked must be greater than 0");
            return res.redirect(`/listings/${listingId}`);
        }

        // Availability logic: sum rooms booked over overlapping date ranges
        const overlappingBookings = await Booking.find({
            listing: listingId,
            status: "confirmed",
            checkIn: { $lt: checkOutDate },
            checkOut: { $gt: checkInDate }
        });

        const bookedRooms = overlappingBookings.reduce((sum, b) => sum + (b.roomsBooked ?? 1), 0);
        const availableRooms = Math.max(0, listing.totalRooms - bookedRooms);

        if (bookedRooms + requestedRooms > listing.totalRooms) {
            req.flash("error", `Only ${availableRooms} rooms available for selected dates`);
            return res.redirect(`/listings/${listingId}`);
        }

        const booking = new Booking({
            user: req.user._id,
            listing: listingId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: requestedGuests,
            roomsBooked: requestedRooms
        });

        await booking.save();

        req.flash("success", "Booking successful!");
        res.redirect("/bookings");

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};


module.exports.booking = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        }).populate("listing");

        res.render("booking/index.ejs", { bookings });

    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to fetch bookings");
        res.redirect("/");
    }
};


module.exports.cancelBook = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("/bookings");
        }

        // Security check
        if (!booking.user.equals(req.user._id)) {
            req.flash("error", "Unauthorized action");
            return res.redirect("/bookings");
        }

        await Booking.findByIdAndDelete(req.params.id);

        req.flash("success", "Booking cancelled successfully!");
        res.redirect("/bookings");

    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to cancel booking");
        res.redirect("/bookings");
    }
};
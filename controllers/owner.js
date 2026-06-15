const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id });

    const computed = await Promise.all(
        listings.map(async (listing) => {
            const totalRooms = listing.totalRooms ?? 1;

            const bookings = await Booking.find({
                listing: listing._id,
                status: "confirmed"
            });

            const roomsBooked = bookings.reduce((sum, b) => sum + (b.roomsBooked ?? 1), 0);
            const availableRooms = Math.max(0, totalRooms - roomsBooked);
            const occupancyPct = totalRooms > 0 ? Math.min(100, (roomsBooked / totalRooms) * 100) : 0;

            return {
                listing,
                totalRooms,
                roomsBooked,
                availableRooms,
                occupancyPct
            };
        })
    );

    res.render("owner/dashboard.ejs", { listings: computed });
};

module.exports.getOwnerListings = async (req, res) => {
    const ownerId = req.user._id;

    const listings = await Listing.find({ owner: ownerId });

    res.render("listings/ownerListing", { listings });
};

module.exports.getOwnerBookings = async (req, res) => {
    const ownerId = req.user._id;

    const listings = await Listing.find({ owner: ownerId }).select("_id");

    const listingIds = listings.map(l => l._id);

    const bookings = await Booking.find({
        listing: { $in: listingIds }
    })
    .populate("listing")
    .populate("user")
    .sort({ createdAt: -1 });

    res.render("booking/ownerBookings", { bookings });    
};
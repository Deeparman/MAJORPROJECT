const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

module.exports.book = async(req,res) => {
    const listingId = req.params.id;
    const { checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    const booking = new Booking({
        user: req.user._id,
        listing: listingId,
        checkIn,
        checkOut,
        guests
    });

    await booking.save();
    req.flash('success', 'Booking successful!');
    res.redirect('/bookings'); 
};


module.exports.booking = async (req , res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('listing');
        res.render('booking/index.ejs', { bookings });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
}

module.exports.cancelBook = async (req,res) =>{
    await Booking.findByIdAndDelete(req.params.id);
  req.flash("success", "Booking cancelled successfully!");
  res.redirect("/bookings");
}
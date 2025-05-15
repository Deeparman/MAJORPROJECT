const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

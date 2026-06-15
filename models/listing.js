const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    totalRooms: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews : [{
        type: Schema.Types.ObjectId,
        ref: "Review" 
    }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ["Mountain", "Historical", "Farm", "Castle", "Beaches","Camping","Amazing pools","Iconic cities","Arctic","Domes","Boats"],
        required: true
    },
        status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending"   
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});  //del all reviews related to the deleted listing
    }
})

const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;



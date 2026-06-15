const mongoose = require("mongoose");
const initData = require("./data.js"); 
const Listing = require("../models/listing.js"); 
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  // get all owners from DB
  const owners = await User.find({ role: "hotelOwner" });

  initData.data = initData.data.map((obj, index) => ({
    ...obj,
    owner: owners[index % owners.length]._id,
    totalRooms: Math.floor(Math.random() * 4) + 1,
    status: "approved",
    reviews: []
  }));

  await Listing.insertMany(initData.data);

  console.log("Listings inserted with owners");
};

initDB();
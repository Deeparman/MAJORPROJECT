const mongoose = require("mongoose");
const User = require("../models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("DB connected");
}

async function createUsers() {
  // clear old users
  await User.deleteMany({});

  // ADMIN
  await User.register(
    {
      username: "admin",
      email: "admin@gmail.com",
      role: "admin"
    },
    "Admin@123"
  );

  // HOTEL OWNERS
  await User.register(
    {
      username: "owner1",
      email: "owner1@gmail.com",
      role: "hotelOwner"
    },
    "Owner1@123"
  );

  await User.register(
    {
      username: "owner2",
      email: "owner2@gmail.com",
      role: "hotelOwner"
    },
    "Owner2@123"
  );

  await User.register(
    {
      username: "owner3",
      email: "owner3@gmail.com",
      role: "hotelOwner"
    },
    "Owner3@123"
  );

  // NORMAL USER
  await User.register(
    {
      username: "user1",
      email: "user1@gmail.com",
      role: "user"
    },
    "User1@123"
  );

  console.log("Users created successfully");
}

main()
  .then(createUsers)
  .then(() => mongoose.connection.close())
  .catch((err) => console.log(err));
# TODO

- [x] Update listing model: add `totalRooms` (default 1)
- [x] Update booking model: add `roomsBooked` (default 1)
- [x] Update booking controller: validate `checkOut > checkIn`, `roomsBooked > 0`, and enforce availability using sum of overlapping `roomsBooked`
- [x] Update booking form (views/listings/show.ejs): add input for `roomsBooked` and pass it to backend
- [x] Update owner dashboard controller (controllers/owner.js): compute rooms stats per listing

- [x] Update owner dashboard EJS (views/owner/dashboard.ejs): show total rooms, rooms booked, available rooms, occupancy percentage
- [x] Provide MongoDB migration/update strategy for existing listings and bookings

Progress:
- [x] Repo inspection (models/booking.js, controllers/booking.js, routes/booking.js, models/listing.js, views/listings/show.ejs, controllers/owner.js, views/owner/dashboard.ejs)
- [x] Implement code updates

# MongoDB migration / update strategy (hotel inventory -> totalRooms / roomsBooked)

## What changed
- `Listing.totalRooms` added (default `1`, min `1`)
- `Booking.roomsBooked` added (default `1`, min `1`)

## Why a migration may be needed
Existing documents created before the schema change may not have these new fields. Since both fields have defaults in the schema, **new documents are fine**, but **existing documents** will have `undefined` values unless you choose to backfill them.

Your current application logic uses fallbacks like `b.roomsBooked ?? 1` and `listing.totalRooms ?? 1`, so the app should keep working even without a migration. However, running the migration keeps data consistent and makes reporting (owner dashboard) accurate.

## Recommended approach: run a one-time backfill script
Run this with `mongosh` (or the MongoDB shell) once.

### Backfill Listing.totalRooms
```js
use wanderlust

db.listings.updateMany(
  { totalRooms: { $exists: false } },
  { $set: { totalRooms: 1 } }
)
```

### Backfill Booking.roomsBooked
```js
use wanderlust

db.bookings.updateMany(
  { roomsBooked: { $exists: false } },
  { $set: { roomsBooked: 1 } }
)
```

## Optional: enforce minimums after backfill
If you ever inserted invalid values (e.g., 0), you can clamp them:

### Listings
```js
db.listings.updateMany(
  { totalRooms: { $lte: 0 } },
  { $set: { totalRooms: 1 } }
)
```

### Bookings
```js
db.bookings.updateMany(
  { roomsBooked: { $lte: 0 } },
  { $set: { roomsBooked: 1 } }
)
```

## Verification
Check a few docs:
```js
db.listings.find({}, { title: 1, totalRooms: 1 }).limit(5)

db.bookings.find({}, { listing: 1, roomsBooked: 1, checkIn: 1, checkOut: 1 }).limit(5)
```

## Notes
- Your app uses an availability check that sums overlapping confirmed bookings:
  - `bookedRooms = sum(roomsBooked)`
  - available if `bookedRooms + requestedRooms <= totalRooms`
- The availability is date-window based.
- If you later add booking statuses other than `confirmed`, update the queries accordingly.


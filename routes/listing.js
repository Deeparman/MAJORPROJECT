const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//other way of writing routes that starts from same pathname  (router.route)
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,  upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))

//Create : NEW ROUTE  
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search",listingController.searchListing);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Update: EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;



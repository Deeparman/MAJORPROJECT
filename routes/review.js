const express = require("express");
const router = express.Router( {mergeParams: true});  //{mergeParams: true} => preserve req.params from parent router
const wrapAsync = require("../utils/wrapasync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController= require("../controllers/review.js");

router.post("/" ,isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;

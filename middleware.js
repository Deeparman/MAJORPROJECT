const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");   //joi
const { reviewSchema } = require("./schema.js");   //joi

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "please login to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of tis listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);  // check if req.body validate all the constraints/cond in listingSchema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);  // check if req.body validate all the constraints/cond in listingSchema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You didnot created this revieew!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

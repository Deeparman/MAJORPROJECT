const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");

const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signUp))

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirect, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.logIn)

router.get("/logout", userController.logOut)

module.exports = router;

// router.get("/signup", userController.renderSignupForm)
// router.post("/signup", wrapAsync(userController.signUp))
// router.get("/login", userController.renderLoginForm)
// router.post("/login", saveRedirect, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.logIn)


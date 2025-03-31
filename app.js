// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

//never share .env file to anyone or on gitHub
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const url = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;

main().then(() => { console.log("SUCCESSFULLY CONNECTED"); })
    .catch((err) => { console.log(err); })

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
})


const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3, //1000 * 60 * 60 * 24 * 3   => days in millisecond
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },

};

store.on("error", (err) => {
    console.log("error in mongo session store", err)
})

app.use(session(sessionoptions));
app.use(flash());  //use flash before routes always

//passport need to used after session 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");  //success is in form of array!
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


//LISTING AND REVIEW ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)


//when no route will match, this will execute
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND "));
})


//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("error.ejs", { err });
    // res.status(status).send(message);
})


app.listen(3000, () => {
    console.log("server is listening to port 3000");
})

const user = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const registeredUser = await user.register(newUser, password);  //sane to db

        //to login automatically after signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "User registered Successfully!! Welcome to Wanderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!!");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
}

module.exports.logOut = (req, res) => {
    req.logOut((err, next) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged Out successfully");
        res.redirect("/listings");
    })
}


module.exports.prof = (req, res) =>{
     if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    
    const currentUser = req.user;  
    
    res.render('users/profile', { username: currentUser.username, email: currentUser.email });
}
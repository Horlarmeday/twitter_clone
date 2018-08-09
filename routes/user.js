const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const passportConfig = require("../config/passport");

//SIGNUP ROUTE 
router.route("/signup")
    .get((req, res, next) => {
        res.render("main/signup", {message: req.flash("errors")});
    })
    .post((req, res, next) => {
        User.findOne({email: req.body.email}, function(err, existingUser) {
            if(existingUser){
                req.flash("errors", "Account with that email already exists");
                res.redirect("/signup");
            }else{
                var user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.photo = user.gravatar();
                user.password = req.body.password;
                user.save(function(err) {
                    req.logIn(user, function (err) {
                        if(err) return next(err);
                        res.redirect("/");
                    });
                });
            }
        });
    });

//LOGIN ROUTES
router.route("/login")
    .get((req, res, next) => {
        if(req.user) res.redirect("/");
        res.render("main/login", {message: req.flash("loginMessage")});
    })
    .post(passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }));

//LOGOUT ROUTES
router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
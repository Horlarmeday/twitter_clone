const router = require("express").Router();
const async = require("async");
const User = require("../models/user");
const Tweet = require("../models/tweet");


//HOME PAGE ROUTE
router.get('/', (req, res, next) => {
    if(req.user){
        Tweet.find({})
          .sort("-creeated")
          .populate("owner")  
          .exec(function (err, tweets) {
            console.log(tweets);
            if(err) return next();
            res.render("main/home", {tweets: tweets})
          })
    }else{
        res.render("main/landing");
    }
});

//USER PROFILE ROUTE
router.get("/user/:id", (req, res, next) => {
    async.waterfall([
        function (callback) {
            Tweet.find({owner: req.params.id})
             .populate("owner")
             .exec(function(err, tweets) {
                 callback(err, tweets);
             });
        },
        function (tweets, callback) {
            User.findOne({_id: req.params.id})
             .populate("following")
             .populate("followers")
             .exec(function (err, user) {
                 //Getting the user followers and also checking if the follower has the ID
                 var follower = user.followers.some(function (friend) {
                     return friend.equals(req.user._id);
                 })
                 var CurrentUser;
                 if(req.user._id.equals(user._id)){
                    CurrentUser = true
                 }else{
                    CurrentUser = false;
                 }
                 res.render("main/user", {foundUser: user, tweets: tweets, CurrentUser: CurrentUser, follower: follower});
             });
        }
    ]);
});

//FOLLOWING AND FOLLOWERS ROUTE
router.post("/follow/:id", (req, res, next) => {
    async.parallel([
        function (callback) {
            User.update(
                {
                    _id: req.user._id,
                    following: { $ne: req.params.id }
                },
                {
                    $push: { following: req.params.id }
                }, function (err, count) {
                    callback (err, count);
                }
            );
        },
        function (callback) {
            User.update(
                {
                    _id: req.params.id,
                    followers: {$ne: req.user._id}
                },
                {
                    $push: {followers: req.user._id}
                }, function (err, count) {
                    callback (err, count);
                }
            );
        }
    ], function (err, results) {
        if(err) return next(err);
        res.json("Success");
    });
}); 

//UNFOLLOWING ROUTE
router.post("/unfollow/:id", (req, res, next) => {
    async.parallel([
        function (callback) {
            User.update(
                {
                    _id: req.user._id,
                },
                {
                    $pull: { following: req.params.id }
                }, function (err, count) {
                    callback (err, count);
                }
            );
        },
        function (callback) {
            User.update(
                {
                    _id: req.params.id,
                },
                {
                    $pull: {followers: req.user._id}
                }, function (err, count) {
                    callback (err, count);
                }
            );
        }
    ], function (err, results) {
        if(err) return next(err);
        res.json("Success");
    });
}); 

module.exports = router;
const async = require("async");
const Tweet = require("../models/tweet");
const User = require("../models/user");

module.exports = function(io) {
    io.on("connection", function(socket) {
        console.log("Connected");
        var user = socket.request.user;
        console.log(user.name);

        //Listens to the incoming tweet from the input
        socket.on("tweet", (data) => {
           async.parallel([
               function(callback) {
                 io.emit("incomingTweets", {data, user});
               },

               function (callback) {
                   async.waterfall([
                       function (callback) {
                           var tweet = new Tweet();
                           tweet.content = data.content;
                           tweet.owner = user._id;
                           tweet.save(function (err) {
                               callback(err, tweet);
                           });
                       },

                       function (tweet, callback) {
                           User.update(
                               {
                                   _id: user._id
                               },
                               {
                                   $push: {tweets: {tweet: tweet._id}},
                               }, function(err, count) {
                                   callback(err, count); //End of code
                               }
                            );
                        }
                    ]);
                }
            ]);
        });
    });
}
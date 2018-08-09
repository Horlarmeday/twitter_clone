const mongoose = require("mongoose");
const TweetSchema =  new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    creeated: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Tweet", TweetSchema);
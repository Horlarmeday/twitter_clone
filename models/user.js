const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    email:{type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    photo: String,
    tweets:[{
        tweet: {type: mongoose.Schema.Types.ObjectId, ref: "Tweet"}
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }]
});

UserSchema.pre("save", function (next) {
    var user = this;
    if(!user.isModified("password")) return next();
    if(user.password){
        bcrypt.genSalt(10, function(err, salt) {
            if(err) return next();
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if(err) return next();
                user.password = hash;
                next(err);
            });
        });
    }
});

//Schema to associate user image to email
UserSchema.methods.gravatar = function(size) {
    if(!size) size = 200;
    if(!this.email) return "https://gravatar.com/avatar/?s=" + size + "&d=retro";
    var md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
};

//Schema to comparing user inputed Password and the passsword in the DB
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", UserSchema);
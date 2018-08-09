const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const passportSocketio = require("passport.socketio");
const cookieParser = require("cookie-parser");
const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/user")
const config = require("./config/secret");

const app = express();
const http = require("http").Server(app); //Requiring socket.io
const io = require("socket.io")(http);
const sessionStore = new MongoStore({url: config.database, autoReconnect: true});


//Connection to the DB
mongoose.connect(config.database, function(err){
    if(err) console.log(err);
    console.log("Connected to the database");
});

// Various Library Use
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); 
app.use(flash());

//saves the user session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: sessionStore
}));

//Passport Config
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

require("./realtime/io")(io); //requiring io

//local function
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Using the socket.io
io.use(passportSocketio.authorize({
    cookieParser: cookieParser,
    key: "connect.sid",
    secret: config.secret,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept) {
    console.log("Successful Connection");
    accept();
}

function onAuthorizeFail(data, message, error, accept) {
    console.log("Failed Connection");
    if(error) accept(new Error(message));
}

//Using the routes
app.use(mainRoutes);
app.use(userRoutes);

//Server listener
http.listen(3030, (err) => {
    if(err) console.log(err);
    console.log('Server running on port 3030..');
});
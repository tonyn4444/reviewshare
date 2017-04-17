var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');

var commentRoutes = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/yelp_camp")
// console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url);
// seedDB();
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Passport configuration
app.use(require("express-session")({
	secret: "Once again Ace wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// method below allows us to authenticate user for login (method from passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// calling app.use on this middleware will call the function on all of our routes
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

var port = process.env.PORT || 3000

app.listen(port, process.env.IP, function() {
	console.log("YelpCamp server started!");
})

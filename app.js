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

// mongoose.connect("mongodb://localhost:27017/yelp_camp")
console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url);
seedDB();
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


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

// Campground.create(
// 	{ 
// 		name: "Woodfair", 
// 		image: "http://www.photosforclass.com/download/5641024448",
// 		description: "This is a huge hill, no bathrooms, no water, and no beautiful granite..."
// 	}, function(err, campground) {
// 		if (err) {
// 			console.log("Could not save campground");
// 		} else {
// 			console.log("Successfully created new campground:");
// 			console.log(campground);
// 		}
// });

	// var campgrounds = [
	// 	{ name: "Camp Palooza", image: "http://www.photosforclass.com/download/5641024448" },
	// 	{ name: "The Wilderness", image: "http://www.photosforclass.com/download/4369518024" },
	// 	{ name: "Woodsfair", image: "http://www.photosforclass.com/download/7626464792" },
	// 	{ name: "Camp Palooza", image: "http://www.photosforclass.com/download/5641024448" },
	// 	{ name: "The Wilderness", image: "http://www.photosforclass.com/download/4369518024" },
	// 	{ name: "Trees and Leaves n Stuff", image: "http://www.photosforclass.com/download/4368764673" },
	// 	{ name: "Trees and Leaves n Stuff", image: "http://www.photosforclass.com/download/4368764673" }

	// ]

app.get('/', function(req, res) {
	res.render('landing');
})

app.get('/campgrounds', function(req, res) {
	// Get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds} );
		}
	});
});

app.get('/campgrounds/new', function(req, res) {
	res.render('campgrounds/new');
});

// show route
app.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
			console.log(foundCampground);
		}
	});
});


app.post('/campgrounds', function(req, res) {

	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description};
	// create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('campgrounds');
		}
	});
	// redirect to campgrounds index
})

// =====================================
// Comments Routes
// =====================================

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground});
		}
	});
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			console.log(req.body.comment)
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	// create new comment
	// connect new comment to campground
	// redirect to campground show page
});

// ================
// AUTH ROUTES
// ================

// show register form
app.get('/register', function(req, res) {
	res.render('register');
});

// handle sign up logic
app.post('/register', function(req, res) {
	var newUser = new User({username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			// return statement short circuits if we get an error and will get us out of the call
			return res.render('register');
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/campgrounds");
		});
	});
});

// show login form
app.get("/login", function(req, res) {
	res.render('login');
});

// handle login logic
// app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
});

// logout route
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
		res.redirect("/campgrounds");
}



var port = process.env.PORT || 3000

app.listen(port, process.env.IP, function() {
	console.log("YelpCamp server started!");
})

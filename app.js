var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');



mongoose.connect("mongodb://localhost:27017/yelp_camp")
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{ 
// 		name: "Camp Palooza", image: "http://www.photosforclass.com/download/5641024448" 
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
			res.render('campgrounds', {campgrounds: allCampgrounds} );
		}
	});
});

app.get('/campgrounds/new', function(req, res) {
	res.render('new');
});


app.post('/campgrounds', function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
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

app.listen(3000, function() {
	console.log("Listening on port 3000");
})

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');



// mongoose.connect("mongodb://localhost:27017/yelp_camp")
// mongoose.connect("mongodb://tonyn4444:22444455a@ds043210.mlab.com:43210/yelpcampx")
console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url);

// mongodb://tonyn4444:22444455a@ds043210.mlab.com:43210/yelpcampx
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

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
			res.render('index', {campgrounds: allCampgrounds} );
		}
	});
});

app.get('/campgrounds/new', function(req, res) {
	res.render('new');
});

// show route
app.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});
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

app.listen(3000, function() {
	console.log("Listening on port 3000");
})

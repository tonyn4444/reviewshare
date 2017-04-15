var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds');

// mongoose.connect("mongodb://localhost:27017/yelp_camp")
console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url);
seedDB();
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


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

app.get('/campgrounds/:id/comments/new', function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground});
		}
	});
});

app.post('/campgrounds/:id/comments', function(req, res) {
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


var port = process.env.PORT || 3000

app.listen(port, process.env.IP, function() {
	console.log("YelpCamp server started!");
})

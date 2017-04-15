var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image: "http://www.photosforclass.com/download/6106475454",
		despcription: "Blah blah blah",
	},
	{
		name: "Willows Peak",
		image: "http://www.photosforclass.com/download/6142484013",
		despcription: "Blah blah blah"
	},
	{
		name: "Camp Wilderness",
		image: "http://www.photosforclass.com/download/9586944536",
		despcription: "Blah blah blah"
	}
]

function seedDB() {
	// Remove all campgrounds
	Campground.remove({}, function(err) {
		if(err) {
			console.log(err);
		}
		console.log("Removed campgrounds!");
			// Add a few campgrounds
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground){
					if(err) {
						console.log(err);
					} else {
						console.log("Added a campground");
						// Create comment
						Comment.create({
							text: "This place is great, but I wish there was internet",
							author: "Homer"
						}, function(err, comment) {
							if(err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Created a new comment");
							}
						});
					}
			});
		});
	});
}


module.exports = seedDB;
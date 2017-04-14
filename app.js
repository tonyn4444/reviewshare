var express = require('express');
var app = express();

app.use(express.static('public'));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
	res.render('landing');
})

app.get('/campgrounds', function(req, res) {
	var campgrounds = [
		{ name: "Woodsfair", image: "http://www.photosforclass.com/download/7626464792" },
		{ name: "Camp Palooza", image: "http://www.photosforclass.com/download/5641024448" },
		{ name: "The Wilderness", image: "http://www.photosforclass.com/download/4369518024" },
		{ name: "Trees and Leaves n Stuff", image: "http://www.photosforclass.com/download/4368764673" }
	]

	res.render('campgrounds', {campgrounds: campgrounds} );
})

app.listen(3000, function() {
	console.log("Listening on port 3000");
})

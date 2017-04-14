var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
app.set("view engine", "ejs");

	var campgrounds = [
		{ name: "Woodsfair", image: "http://www.photosforclass.com/download/7626464792" },
		{ name: "Camp Palooza", image: "http://www.photosforclass.com/download/5641024448" },
		{ name: "The Wilderness", image: "http://www.photosforclass.com/download/4369518024" },
		{ name: "Trees and Leaves n Stuff", image: "http://www.photosforclass.com/download/4368764673" }
	]

app.get('/', function(req, res) {
	res.render('landing');
})

app.get('/campgrounds', function(req, res) {

	res.render('campgrounds', {campgrounds: campgrounds} );
})

app.get('/campgrounds/new', function(req, res) {
	res.render('new');
});


app.post('/campgrounds', function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	// create a new campground
	// redirect to campgrounds index
	res.redirect('campgrounds');
})

app.listen(3000, function() {
	console.log("Listening on port 3000");
})

var express = require('express')
var getJSON = require('get-json');
var request = require('request');
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000
var app = express();

app.use('/', express.static('public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.listen(PORT, function () {
	console.log('Server running on PORT ', PORT);
});

app.get('/search', function (req, res) {
	var city = req.query.city;
	var link = "https://nominatim.openstreetmap.org/search?email=marco.boffo@studenti.unitn.it&city=" + city + "&format=json&limit=1";
	var retval = inizioHTML();
	retval += city + "<br />";
	console.log("City: " + city);
	console.log("Link: " + link);
	request(link, function (err, resp, body) {
		var response = JSON.parse(body);
		var latidute = response[0].lat;
		var longitude = response[0].lon;
		const url = "http://api.geonames.org/timezoneJSON?username=boffomarco&lat=" + latidute + "&lng=" + longitude;
		console.log("Latitude: " + latidute + " Longitude: " + longitude);
		console.log("URL: " + url);
		request(url, function (err, respo, bodys) {
			var responses = JSON.parse(bodys);
			var sunrise = responses.sunrise;
			var sunset = responses.sunset;
			console.log("Sunrise: " + sunrise + " Sunset: " + sunset);
			retval += "Sunrise: " + sunrise + " Sunset: " + sunset + "<br />";
			retval += fineHTML();
			res.status(201).send(retval);
		});
	});
});

function inizioHTML() {
	var temp = "<!DOCTYPE html>\n";
	temp += "	<html>\n";
	temp += "		<head>\n";
	temp += "			<meta charset=\"utf-8\">\n";
	temp += "				<title>Sunrise & Sunset</title>\n";
	temp += "		</head>\n";
	temp += "		<body>\n";
	temp += "			<h1>Insert your city to get sunrise and sunset</h1>\n";
	temp += "			<form method=\"get\" action=\"/search\">\n";
	temp += "					<input type=\"text\" name=\"city\" placeholder=\"Insert city here\">\n";
	temp += "				<p>\n";
	temp += "					<input type=\"submit\" value=\"search\">\n";
	temp += "			</p>\n";
	temp += "			</form>\n";
	return temp;
}

function fineHTML() {
	var temp = "	</body>\n";
	temp += "	</html>";
	return temp;
} 
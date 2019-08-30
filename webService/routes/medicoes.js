var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoOp = require("./../models/medicoesDAO");
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));

router.get("/:idParam", function (req, res) {
	idParam = req.params.idParam;
	var response = {};
	mongoOp.find({idDispositivo:idParam}, function (err, data) {
		if (err) {
			response = { "error": true, "message": "Error fetching data" };
		} else {
			response = { "error": false, "message": data };
		}
		res.status(200).json(response);
	});
});

router.post("/", function (req, res) {
	var item ={};
	for (var [key, value] of Object.entries(req.body)) {
		item[key]= value;		
	}
	var db = new mongoOp(item);
	var response = {};
	db.save(function (err) {
		if (err) {
			response = { "error": true, "message": "Error adding data" };
		} else {
			response = { "error": false, "message": "Data added" };
		}
		res.status(200).json(response);
	});
});

module.exports = router;
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var middlewareAutenticar = require("../middleware/autenticar");

var router = express.Router();
var consMysql = 'mysql://root:@localhost:3306/iotmashups2';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));

router.get('/', async function (req, res) {
	let sql
	if (req.query.idDispositivo) {
		sql = "SELECT * FROM mqtts WHERE idDispositivos = " + req.query.idDispositivo
	} else {
		sql = "SELECT * FROM mqtts"
	}

	const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function (error, results) {
		if (error) {
			return res.status(304).end();
		}
		let resposta = results;
		if (req.query.idDispositivo)
			resposta = results[0]
		return res.status(200).send(resposta);
	});
});

router.post('/', async function (req, res) {
	let mqtt = [];
	mqtt.push(req.body.mqtt.URL);
	mqtt.push(req.body.mqtt.port);
	mqtt.push(req.body.mqtt.clienteId);
	mqtt.push(req.body.mqtt.username ? req.body.mqtt.username : null);
	mqtt.push(req.body.mqtt.password ? req.body.mqtt.password : null);
	mqtt.push(req.body.mqtt.topic);
	mqtt.push(req.body.mqtt.idDispositivo);
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO mqtts(URL, port, clienteId, username, password, topic, idDispositivos) VALUES (?,?,?,?,?,?,?)", mqtt, async function (error, results) {
		if (error) {
			return res.status(304).end();
		}
		let resposta = results[0];
		return res.status(200).send(resposta);
	});
})

router.put('/', async function (req, res) {
	let mqtt = [];
	mqtt.push(req.body.mqtt.URL);
	mqtt.push(req.body.mqtt.port);
	mqtt.push(req.body.mqtt.clienteId);
	mqtt.push(req.body.mqtt.username ? req.body.mqtt.username : null);
	mqtt.push(req.body.mqtt.password ? req.body.mqtt.password : null);
	mqtt.push(req.body.mqtt.topic);
	mqtt.push(req.body.mqtt.id);
	const connection = mysql.createConnection(consMysql);
	await connection.query("UPDATE mqtts SET URL=?,port=?,clienteId=?,username=?,password=?,topic=? WHERE id = ?", mqtt, async function (error, results) {
		if (error) {
			console.log(error)
			return res.status(304).end();
		}
		return res.status(200).end();
	});
})

router.delete('/:id', async function (req, res) {
	let id = [req.params.id];
	console.log(id);
	const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM mqtts WHERE id = ?", id, async function (error, results) {
		if (error) {
			console.log(error)
			return res.status(404).end();
		}
		return res.status(200).end();
	});
})

module.exports = router;

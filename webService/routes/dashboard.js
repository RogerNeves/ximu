var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var middlewareAutenticar = require("../middleware/autenticar");

var router = express.Router();
var consMysql = 'mysql://root:@localhost:3306/iotmashups2';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', async function(req,res){
	let sql = "SELECT * FROM dashboards WHERE idUsuarios = " + req.usuarioId;
    
    const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function(error, results){
		if (error) {
			return res.status(304).end();
		}	
		let resposta = results;
		return res.status(200).send(resposta);
	});
});

router.post('/', async function(req,res) {
	let dashboard =[];
	dashboard.push( req.body.dashboard.nome );
    dashboard.push( req.usuarioId );
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO dashboards(nome, idUsuarios) VALUES (?,?)", dashboard, async function(error, results){
		if (error) {
			return res.status(304).end();
		}	
        let resposta = results[0];
		return res.status(200).send(resposta);
	});
})

router.put('/:id', async function(req,res){
    let dashboard =[];
	dashboard.push( req.body.dashboard.nome );
	dashboard.push( req.body.dashboard.id )
    const connection = mysql.createConnection(consMysql);
	await connection.query("UPDATE dashboards SET nome=?, WHERE id = ?", dashboard, async function(error, results){
		if (error) {
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

router.delete('/:id', async function(req,res){
    let id = [req.params.id];
    console.log(id);
    const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM dashboard WHERE id = ?", id, async function(error, results){
		if (error) {
            console.log(error)
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

module.exports = router;

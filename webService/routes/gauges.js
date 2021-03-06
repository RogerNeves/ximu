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
 
router.get('/:idVisualizacao', async function(req,res){
    let sql = "SELECT * FROM gauges WHERE idVisualizacao = "+req.params.idVisualizacao;
    
    const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function(error, results){
		if (error) {
			return res.status(304).end();
		}	
        let resposta = results[0];
		return res.status(200).send(resposta);
	});
});

router.post('/', async function(req,res) {
	const gauge =[];
	gauge.push( req.body.gauge.nome );
	gauge.push( req.body.gauge.idDashboard );
    gauge.push( req.body.gauge.idDadosEntrada );
	gauge.push( req.body.gauge.criacao );
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO gauges(nome, idDashboard, idDadosEntrada, criacao) VALUES (?,?,?,?)", gauge, async function(error, results){
		if (error) {
			return res.status(404).end();
		}	
        let resposta = results[0];
		return res.status(200).send(resposta);
	});
})


router.delete('/:id', async function(req,res){
    let id = [req.params.id];
    console.log(id);
    const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM gauge WHERE id = ?", id, async function(error, results){
		if (error) {
            console.log(error)
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

module.exports = router;

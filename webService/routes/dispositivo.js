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
	let sql
	if(req.query.id){
        sql = "SELECT * FROM dispositivos WHERE id = "+req.query.id;
	}
	else if(req.query.modelo){
		sql = "SELECT * FROM dispositivos WHERE idModelos = "+req.query.modelo;
	}else{
        sql = "SELECT dispositivos.id AS idDispositivo,dispositivos.nome AS dispositivo, modelos.nome AS modelo FROM dispositivos INNER JOIN modelos on dispositivos.idModelos = modelos.id WHERE modelos.idUsuarios = " + req.usuarioId;
    }
    
    const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function(error, results){
		if (error) {
			return res.status(304).end();
		}
		let resposta = results;
		if(req.query.id){
			resposta = results[0]
		}
		return res.status(200).send(resposta);
	});
});

router.post('/', async function(req,res) {
	let dispositivo =[];
	dispositivo.push( req.body.dispositivo.nome );
	dispositivo.push( parseInt( req.body.dispositivo.IdModelos ) );
    dispositivo.push( req.usuarioId );
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO dispositivos(nome, idModelos,idUsuarios) VALUES (?,?,?)", dispositivo, async function(error, results){
		if (error) {
			console.log(error);
			
			return res.status(304).end();
		}	
        let resposta = results[0];
		return res.status(200).send(resposta);
	});
})

router.put('/', async function(req,res){
    let dispositivo =[];
	dispositivo.push( req.body.dispositivo.nome );
	dispositivo.push( req.body.dispositivo.id)
	console.log(dispositivo)
    const connection = mysql.createConnection(consMysql);
	await connection.query("UPDATE dispositivos SET nome=? WHERE id = ?", dispositivo, async function(error, results){
		if (error) {
			return res.status(304).end();
		}	
		return res.status(200).end();
	});
})

router.delete('/:id', async function(req,res){
    let id = [req.params.id];
    console.log(id);
    const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM dispositivos WHERE id = ?", id, async function(error, results){
		if (error) {
            console.log(error)
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

module.exports = router;

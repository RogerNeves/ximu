var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var middlewareAutenticar = require("./../middleware/autenticar");

var router = express.Router();
var consMysql = 'mysql://root:@localhost:3306/iotmashups';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', async function(req,res){
    let id =[req.usuarioId];
    const connection = mysql.createConnection(consMysql);
	await connection.query("SELECT * FROM usuarios WHERE id = ?", id, async function(error, results){
		if (error) {
			return res.status(404).end();
		}	
        let resposta = results[0];
		return res.status(200).send(resposta);
	});
});

router.put('/', async function(req,res){
    let usuario =[];
    usuario[0] = req.body.usuario.nome;
    usuario[1] = req.body.usuario.telegram;
    usuario[2] = req.usuarioId;
    const connection = mysql.createConnection(consMysql);
	await connection.query("UPDATE usuarios SET nome=?,telegram= ? WHERE id = ?", usuario, async function(error, results){
		if (error) {
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

router.delete('/', async function(req,res){
    let id = [req.usuarioId];
    console.log(id);
    const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM usuarios WHERE id = ?", id, async function(error, results){
		if (error) {
            console.log(error)
			return res.status(404).end();
		}	
		return res.status(200).end();
	});
})

module.exports = router;

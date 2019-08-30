const express = require('express');
const app = express();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const autenticar = require("./../config/autenticar");

const router = express.Router();
const consMysql = 'mysql://root:@localhost:3306/iotmashups2';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


/*login*/
router.post('/', async function(req,res,next){
	let email = [];
	email = req.body.login.email;
	let senha =	req.body.login.senha;
	const connection = mysql.createConnection(consMysql);
	await connection.query("SELECT * FROM logins WHERE email = ?", email, async function(error, results){
		if (error) {
			return res.status(304).end();
		}	
		
		if(!await bcrypt.compareSync(senha,results[0].senha)){
			return res.status(401).send({erro:"senha invalida"});
		}
		
		var token = jwt.sign({id:results[0].idUsuarios},autenticar.segredo)

		//console.log(token);
		let resposta = {token};
		return res.status(200).json(resposta);
	});
	
});

/* cadastro */
router.post('/cadastro', async function (req, res, next) {
	let usuario = [];
	usuario[0] = req.body.cadastro.usuario;
	let login = [];
	login[0] = req.body.cadastro.email;
	if(req.body.cadastro.senha == req.body.cadastro.confirmarSenha ){
		login[1] = req.body.cadastro.senha;
	}
	
	console.log(login);
	const connection = mysql.createConnection(consMysql);
	//console.log(connection.connect());
	await connection.query("INSERT INTO usuarios(nome) VALUES(?)", usuario, async function (error, results, fields) {
		if (error) {
			res.status(400).end();
		}
		login[2] = results.insertId;
		var hash = await bcrypt.hash(login[1], 10);
		login[1] = hash;
		await connection.query('INSERT INTO logins(email, senha, idUsuarios) VALUES (?,?,?)', login, async function (error, results, fields) {
			if (error) {
				res.status(400).end();
			}
		});
		res.status(201).end();
	});
});


module.exports = router;


var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var middlewareAutenticar = require("./../middleware/autenticar");

var router = express.Router();
var consMysql = 'mysql://root:@localhost:3306/iotmashups2';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', async function (req, res) {
  let sql;
  if (req.query.id) {
    sql = "SELECT * FROM modelos WHERE id = " + req.query.id;
  } else {
    sql = "SELECT * FROM modelos WHERE idUsuarios = " + req.usuarioId;
  }

  const connection = mysql.createConnection(consMysql);
  await connection.query(sql, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    let resposta = results;
    if (req.query.id) {
      resposta = results[0];
    }
    return res.status(200).send(resposta);
  });
});

router.post('/', async function (req, res) {
  let modelo = [];
  modelo.push(req.body.modelo.nome);
  modelo.push(req.usuarioId);
  const connection = mysql.createConnection(consMysql);
  await connection.query("INSERT INTO modelos(nome, idUsuarios) VALUES (?,?)", modelo, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    const dados = req.body.dados.map(dado => [dado.nome, results.insertId, parseInt(dado.idTiposDados)])
    console.log(dados);
    const values = dados.map(()=>"(?)")
    await connection.query("INSERT INTO dadosentrada(nome, IdModelos, idTiposDados) VALUES "+values.join(",") , dados, async function (error, results) {
      if (error) {
        return res.status(304).end();
      }
      let resposta = results;

      return res.status(200).send(resposta);
    });

  });
})

router.put('/', async function (req, res) {
  let modelo = [];
  modelo.push(req.body.modelo.nome);
  modelo.push(req.body.modelo.Id);
  const connection = mysql.createConnection(consMysql);
  await connection.query("UPDATE modelos SET nome=? WHERE id = ?", modelo, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    return res.status(200).end();
  });
})

router.delete('/:id', async function (req, res) {
  let id = [req.params.id];
  console.log(id);
  const connection = mysql.createConnection(consMysql);
  await connection.query("DELETE FROM modelo WHERE id = ?", id, async function (error, results) {
    if (error) {
      console.log(error)
      return res.status(404).end();
    }
    return res.status(200).end();
  });
})

module.exports = router;

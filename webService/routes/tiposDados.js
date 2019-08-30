const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require("body-parser");
const middlewareAutenticar = require("../middleware/autenticar");

const router = express.Router();
const consMysql = 'mysql://root:@localhost:3306/iotmashups2';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', function (req, res, next) {
    let sql;
    if (req.query.id) {
        sql = "SELECT * FROM tiposdados WHERE idDados = " + req.query.id;
    } else {
        sql = "SELECT * FROM tiposdados";
    }
    const connection = mysql.createConnection(consMysql);
    connection.query(sql, function (error, results) {
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

module.exports = router;

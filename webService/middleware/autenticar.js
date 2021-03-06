const jwt = require("jsonwebtoken");
const autenticar = require("./../config/autenticar.json");

module.exports = function (req, res, next) {
    const tokenHeader = req.headers.token;
    if (!tokenHeader) {
        return res.status(401).send({ erro: "token não enviado" })
    }
    
    const partes = tokenHeader.split(" ");
    
    if (partes.length !== 2) {
        return res.status(401).send({ erro: "erro no token" });
    }
    
    const [teste,token] = partes;

    if (!/^Bearer$/i.test(teste)){
        return res.status(401).send({erro:"token mal formatado"});
    }
    jwt.verify(token,autenticar.segredo, function (err,decoded){
        if(err){
            return res.status(401).send({erro:"token invalido"});
        }
        req.usuarioId = decoded.id;
        return next();
    })

}
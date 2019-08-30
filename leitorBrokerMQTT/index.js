var mqtt = require('mqtt');
var axios = require("axios");
var conexoes = [];
var resposta = [];
var getConexoes = function () {
    let url = "http://localhost:3001/mqtt";
    axios.get("http://localhost:3001/mqtt")
        .then(function (response) {
            let index = 0;
            if (conexoes != []) {
                while (resposta[index] != null) {
                    conexoes[index].end();
                    index++;
                }
            }
            conexoes = [];
            resposta = response.data;
            index = 0;
            while (resposta[index] != null) {
                conexoes[index] = mqtt.connect(resposta[index].URL,
                    {
                        clientId: resposta[index].clienteId,
                        username: resposta[index].username,
                        password: resposta[index].password,
                        clean: true
                    });
                conexoes[index].topico = resposta[index].topic;
                conexoes[index].addListener("connect", function (connack) {
                    conectar(this, this.topico);
                    console.log(conexoes[index])
                });
                conexoes[index].addListener('message', enviar);
                index++;
            }
        }).catch(function (error) {
            console.log(error)
        });
};
var conectar = function (conexao, topic) {
    conexao.subscribe(topic);
};
var enviar = function (topic, message, packet) {
    const obj = JSON.parse(message);
    console.log(obj)
    axios.post('http://localhost:3001/medicoes', obj)
        .then(function (response) {
        });
};
setInterval(getConexoes, 10000);







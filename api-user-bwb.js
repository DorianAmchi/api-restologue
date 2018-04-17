// Import du framework express
var express = require("express");

// Import du framework body-parser
var bodyParser = require("body-parser");

// Création d'un objet express
var application = express();

application.listen(12108, "192.168.1.54");
console.log("L'application est en cours de route");

application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
    extended: true
}));

var users = {
    "pseudo": "gerard",
    "password": "gegedu34",
    "connected": "false"
};

application.post("/verify",
    function (request, response) {
        var demande = request.body;
        var serverResponse = verifyUser(demande);
        if (serverResponse) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.status(200).send("gg");
        } else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.status(401).send("bg");
        }
    }
);

function verifyUser(demande) {
    var is_connected = false;
    if (users.pseudo === demande.pseudo && users.password === demande.password) {
        is_connected = true;
    }
    return is_connected;
}
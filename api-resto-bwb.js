// Import du framework express
var express = require("express");

// Import du framework body-parser
var bodyParser = require("body-parser");

// Création d'un objet express
var application = express();

application.listen(12109, "192.168.1.54");
console.log("L'application est en cours de route");

application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
    extended: true
}));

var cartes = [];

//Récupération des cartes
application.get("/cartes/get",
    function (request, response) {
        response.json(cartes);
    }
);

//Ajout de cartes. Doit recevoir un json contenant le nom de la carte.
application.post("/cartes/add",
    function (request, response) {
        let newCarte = request.body;
        newCarte.id = generateId();
        cartes.push(newCarte);
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.status(200).json(cartes);

    }
);

//Fonction pour de création d'un id
function generateId() {
    var idMax = 0;
    for (var i in cartes) {
        let id = cartes[i].id;
        idMax = (idMax < id) ? id : idMax;
    }
    return idMax + 1;
}

//Permet de delete une carte. Utilise l'id mis en param
application.delete("/cartes/:id/remove",
    function (request, response) {
        let id = parseInt(request.params.id);
        let placeCarte = getCarte(id);
        cartes.splice(placeCarte, 1);
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(cartes);
    }
);

//Permet de récupérer une carte spécifique. Utilise l'id mis en param
application.get("/cartes/:id/get",
    function (request, response) {
        let id = parseInt(request.params.id);
        let placeCarte = getCarte(id);
        console.log(placeCarte);
        let carte = cartes[placeCarte];
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(carte);
    }
);

application.post("/cartes/:id/menus/add",
    function (request, response) {
        let id = parseInt(request.params.id);
        addMenu(id, request);
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(cartes);
    }
);

function addMenu(id, request) {
    var carte = cartes[getCarte(id)];
    if (carte.menu === undefined) {
        carte.menu = request.body;
        carte.menu.id = id+0;
    } else {
        var tailleMenu = carte.menu.length;
        carte.menu.push(request.body);
        carte.menu.id = id + tailleMenu;
    }
}


application.get("/cartes/menus/get",
    function (request, response) {
        let menu = allMenu();
        console.log(menu);
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(menu);
    }
);

function allMenu() {
    var menu = [];
    for (var i = 0; i < cartes.length; i++) {
        let carte = cartes[i];
        for (var j = 0; j < carte.menu.length; j++) {
            menu.push(carte.menu);
        }
    }
    return menu;
}

application.get("/cartes/:id/menus/get",
    function (request, response) {
        let id = parseInt(request.params.id);
        console.log(id);
        let menu = cartes[getCarte(id)].menu;
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(menu);
    }
);

function getCarte(id) {
    for (var i = 0; i < cartes.length; i++) {
        if (cartes[i].id === id) {
            return i;
        }
    }
}
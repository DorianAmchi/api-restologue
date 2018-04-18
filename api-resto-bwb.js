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

application.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
        response.status(200).json(cartes);
    }
);

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
        let carte = cartes[placeCarte];
        response.status(200).json(carte);
    }
);

//Permet d'ajouter un menu à une carte. Doit recevoir l'entree, le plat, et le dessert ainsi que leurs prix.
//Doit aussi recevoir l'id de la carte correspondante en params.
application.post("/cartes/:id/menus/add",
    function (request, response) {
        let id = parseInt(request.params.id);
        addMenu(id, request);
        response.status(200).json(cartes);
    }
);

// Permet de récupérer toutes les cartes. Retourne un 
application.get("/menus/get",
    function (request, response) {
        var menu = [];
        for (var i in cartes) {
            menu[i] = cartes[i].menu;
        }
        response.status(200).json(menu);
    }
);

application.get("/cartes/:id/menus/get",
    function (request, response) {
        let id = parseInt(request.params.id);
        get
        console.log(id);
        let menu = cartes[getCarte(id)].menu;
        response.status(200).json(menu);
    }
);
application.delete("/cartes/:id/menus/remove",
    function (request, response) {
        let id = parseInt(request.params.id);
        let carte = cartes[getCarte(id)];
        removeMenus(carte);
        console.log(carte);
        response.status(200).json(carte);
    }
);

application.get("/cartes/menus/:id/get",
    function (request, response) {
        var id = parseInt(request.params.id);
        var idMenu = id + "";
        let menu = getMenuById(idMenu, id);
        response.status(200).json(menu);
    }
);

application.delete("/cartes/menus/:id/remove",
    function (request, response) {
        var id = parseInt(request.params.id);
        var idMenu = id + "";
        var idCarte = idMenu[0];
        var carte = cartes[getCarte(parseInt(idCarte))];
        for (var i in carte.menu) {
            if (carte.menu[i].id === id) {
                var pos = i;
                var menu = carte.menu[i]
            }
        }
        carte.menu.splice(pos, 1);
        response.status(200).json(carte);
    }
);

application.post("/cartes/menus/:id/update",
    function (request, response) {
        let newMenu = request.body;
        var id = parseInt(request.params.id);
        newMenu.id = id;
        var idMenu = id + "";
        var idCarte = idMenu[0];
        var carte = cartes[getCarte(parseInt(idCarte))];
        for (var i in carte.menu) {
            if (carte.menu[i].id === id) {
                var pos = i;
                var menu = carte.menu[i]
            }
        }
        carte.menu.splice(pos, 1, newMenu);
        response.status(200).json(carte);
    }
);

function getMenuById(idMenu, id) {
    let idCarte = idMenu[0];
    let carte = cartes[getCarte(parseInt(idCarte))];
    for (var i in carte.menu) {
        if (carte.menu[i].id === id) {
            var menu = carte.menu[i];
            return menu;
        }
    }
}
//Fonction pour de création d'un id
function generateId() {
    var idMax = 0;
    for (var i in cartes) {
        let id = cartes[i].id;
        idMax = (idMax < id) ? id : idMax;
    }
    return idMax + 1;
}

//Fonction qui ajoute la carte et son id.
function addMenu(id, request) {
    var carte = cartes[getCarte(id)];
    if (carte.menu === undefined) {
        carte["menu"] = [];
        var menu = request.body;
        menu.id = parseInt(id + "" + 0);
        carte["menu"][0] = menu;
    } else {
        var tailleMenu = carte.menu.length;
        var menu = request.body;
        menu.id = parseInt(id + "" + tailleMenu);
        carte.menu.push(menu);
    }
}

function getCarte(id) {
    for (var i = 0; i < cartes.length; i++) {
        if (cartes[i].id === id) {
            return i;
        }
    }
}

function removeMenus(carte) {
    while (carte.menu.length !== 0) {
        carte.menu.splice(0, 1);
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register"); // Used to take into account path declaration for modules
// See declarations in package.json
const http = require("http"); // HTTP server
const https = require("https"); // HTTPS server
const express = require("express"); // The application server
const bodyParser = require("body-parser"); // Parse HTTP GET and POST variables
const path = require("path"); // Deal with system paths
const fs = require("fs-extra");
const router_1 = require("./router");
const mongo_1 = require("@data/mongo");
const Infirmier_1 = require("./class/Infirmier");
const app = express();
// HTTP
const serverHTTP = http.createServer(app);
const portHTTP = process.env.PORT || 8080;
serverHTTP.listen(portHTTP, () => {
    console.log(`HTTP server running on port ${portHTTP}.`);
});
// HTTPS
const portHTTPS = 8443;
const TLS_SSL = {
    key: fs.readFileSync(path.join("./app/MM.pem")),
    cert: fs.readFileSync(path.join("./app/certificat.pem"))
};
const serverHTTPS = https.createServer(TLS_SSL, app);
serverHTTPS.listen(portHTTPS, () => {
    console.log(`HTTPS server running on port ${portHTTPS}. `);
});
// Configure the web server
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "Il va falloir implémenter tout ça... peut etre... un jour" });
    mongo_1.connectToMongo();
});
const datapath = path.join(__dirname, "../app/data");
console.log(datapath);
app.use("/data", express.static(datapath));
app.get("/test", (req, res) => {
    res.end("Ok tout va bien");
});
app.get("/testParams", (req, res) => {
    // res.charset="UTF-8";
    res.setHeader("Content-type", "Text/html;charset=UTF-8");
    if (req.query.nom === undefined || req.query.prenom === undefined) {
        res.status(400);
        res.send("Vous devez spécifier un nom et un prenom");
    }
    else {
        // let str = "";
        // let wanted = ['nom','prenom'];
        for (let attr in req.query) {
            // str +="${attr} : ${req.query[attr]}\n";
            // str += attr+" : "+req.query[attr]+"\n";
            // res.write('${attr} : ${req.query[attr]}\n');
            res.write(attr + " : " + req.query[attr] + "\n");
        }
        // res.json(req.query);
        // res.end(str);
        res.end();
    }
});
app.get("/getDataCabinet", (req, res) => {
    // getAllNurses().get(1).toJson();
    let ns = Infirmier_1.getAllNurses();
    for (let i of ns) {
        res.json(ns.get(i).toJson());
    }
    // res.json(getAllNurses().get("1").toJson());
});
app.use("/patient", router_1.getRouterPatientRestApi());
app.use("/nurse", router_1.getRouterNurseRestApi());
mongo_1.loadDatabase();

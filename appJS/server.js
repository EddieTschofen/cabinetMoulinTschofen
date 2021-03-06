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
const passport = require("passport");
const cookieParser = require("cookie-parser");
const OAuth_1 = require("@OAuth/OAuth");
const session = require("express-session");
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
});
// Auth
let sessionMiddleware = session({
    secret: "thisIsAVerySecretMessage",
    resave: true,
    saveUninitialized: true
});
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
const IdentifiedOrLogin = OAuth_1.checkIsAuthentified(401, "/login");
// Utilisez ensuite IdentifiedOrLogin conditionner l’accès aux ressource “/” et “/data” par exemple, vérifiez que cela fonctionne.
// Static files
app.get("/login", (req, res) => {
    let PATH_TO_LOGIN_HTML = "OAuth/login.html";
    res.sendFile(path.join(__dirname, PATH_TO_LOGIN_HTML));
});
const datapath = path.join(__dirname, "../app/data");
console.log(datapath);
app.use("/data", express.static(datapath));
app.get("/test", IdentifiedOrLogin, (req, res) => {
    console.log("/test");
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
// let configGoogle = {
//     GOOGLE_CLIENT_ID : "1054178353181-8l4urm2hkek8vmr9q2av4uqpbdgde88a.apps.googleusercontent.com",
//     GOOGLE_CLIENT_SECRET : "759FeS5Egj5J_0Y8WqC1qWWB"
// };
// app.use(initOAuthGoogle(configGoogle));
app.use(OAuth_1.RegisterOAuth(app));
app.use("/patient", router_1.getRouterPatientRestApi());
app.use("/nurse", router_1.getRouterNurseRestApi());
mongo_1.loadDatabase();

import "module-alias/register"; // Used to take into account path declaration for modules
// See declarations in package.json

import * as http from "http";                   // HTTP server
import * as https from "https";                 // HTTPS server
import * as express from "express";             // The application server
import * as bodyParser from "body-parser";      // Parse HTTP GET and POST variables
import * as path from "path";                   // Deal with system paths
import * as fs from "fs-extra";
import {getRouterNurseRestApi, getRouterPatientRestApi} from "./router";
import {connectToMongo, loadDatabase} from "@data/mongo";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import {checkIsAuthentified} from "@OAuth/OAuth";
import {initOAuthGoogle} from "@OAuth/OAuthGoogle";
import * as session from "express-session";

const app: express.Application = express();

// HTTP
const serverHTTP = http.createServer(app);
const portHTTP = process.env.PORT || 8080;
serverHTTP.listen(portHTTP, () => {
    console.log(`HTTP server running on port ${portHTTP}.`);
});

// HTTPS
const portHTTPS = 8443;
const TLS_SSL =	{
    key : fs.readFileSync( path.join("./app/MM.pem"		 ) ),
    cert: fs.readFileSync( path.join("./app/certificat.pem") )
};
const serverHTTPS = https.createServer(TLS_SSL, app);
serverHTTPS.listen(portHTTPS, () => {
    console.log(`HTTPS server running on port ${portHTTPS}. `);
});

// Configure the web server
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
   res.json( {message: "Il va falloir implémenter tout ça... peut etre... un jour"} );
   connectToMongo();
});
// Auth
let sessionMiddleware = session({
   secret: "thisIsAVerySecretMessage",
   resave: true,
   saveUninitialized: true
});

app.use( cookieParser()        );
app.use( sessionMiddleware     );
app.use( passport.initialize() );
app.use( passport.session()    );



const IdentifiedOrLogin = checkIsAuthentified(401, "/login");

// Utilisez ensuite IdentifiedOrLogin conditionner l’accès aux ressource “/” et “/data” par exemple, vérifiez que cela fonctionne.

// Static files
app.get("/login", (req, res) => {
    let PATH_TO_LOGIN_HTML = "OAuth/login.html";
    res.sendFile( path.join(__dirname, PATH_TO_LOGIN_HTML) );
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
        res.write(attr + " : " + req.query[attr] + "\n" );
      }
      // res.json(req.query);
      // res.end(str);
      res.end();
  }
});


let configGoogle = {
    GOOGLE_CLIENT_ID : "1054178353181-8l4urm2hkek8vmr9q2av4uqpbdgde88a.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET : "759FeS5Egj5J_0Y8WqC1qWWB"
};
app.use(initOAuthGoogle(configGoogle));
app.use("/patient", getRouterPatientRestApi());
app.use("/nurse", getRouterNurseRestApi());

loadDatabase();

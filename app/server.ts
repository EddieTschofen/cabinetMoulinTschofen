import "module-alias/register"; // Used to take into account path declaration for modules
// See declarations in package.json

import * as http from "http";                   // HTTP server
import * as https from "https";                 // HTTPS server
import * as express from "express";             // The application server
import * as bodyParser from "body-parser";      // Parse HTTP GET and POST variables
import * as path from "path";                   // Deal with system paths
import * as fs from "fs-extra";
import {getRouterNurseRestApi, getRouterPatientRestApi, getUnaffectedPatients} from "./router";
import {connectToMongo, initDdbTest, loadDatabase} from "@data/mongo";
import {addPatientTo, getAllNurses} from "./class/Infirmier";
import {getAllPatients} from "./class/Patient";


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

const datapath = path.join(__dirname, "../app/data");
console.log(datapath);

app.use("/data", express.static(datapath));

app.get("/testParams", (req, res) => {
  res.setHeader("Content-type", "Text/html;charset=UTF-8");
  if (req.query.nom === undefined || req.query.prenom === undefined) {
    res.status(400);
    res.send("Vous devez spécifier un nom et un prenom");
  }
  else {
      for (let attr in req.query) {
        res.write(attr + " : " + req.query[attr] + "\n" );
      }
      res.end();
  }
});



app.use("/patient", getRouterPatientRestApi());
app.use("/nurse", getRouterNurseRestApi());



// app.get("/getDataCabinet", (req, res) => {
//     // getAllNurses().get(1).toJson();
//     let ns = getAllNurses();
//     let nurseJson = {};
//     let index = 1;
//     for (let i of ns.values()) {
//         nurseJson["nurse" + index] = i;
//         index++;
//     }
//
//     let ps = getAllPatients();
//     let patientJson = {};
//     index = 1;
//     for (let i of ps.values()) {
//         patientJson["patient" + index] = i;
//         index++;
//     }
//
//     let unaffectedPatients = getUnaffectedPatients();
//     let upsJson = {};
//     index = 1;
//     for (let ups of unaffectedPatients) {
//         upsJson["unaffectedPatient" + index] = ups;
//         index++;
//     }
//
//     let cabinet = {};
//     cabinet["name"] = "Cabinet Moulin-Tschofen";
//     cabinet["address"] = "Saint-Brieuk";
//     cabinet["nurses"] = nurseJson;
//     cabinet["patients"] = patientJson;
//     cabinet["unaffectedPatients"] = upsJson;
//
//     res.json(cabinet);
//     // res.json(getAllNurses().get("1").toJson());
// });

app.get("/getDataCabinet", (req, res) => {
    // getAllNurses().get(1).toJson();
    let ns = getAllNurses();
    let nurseJson = []
    for (let i of ns.values()) {
        nurseJson.push(i);
    }

    let ps = getAllPatients();
    let patientJson = [];
    for (let i of ps.values()) {
        patientJson.push(i);
    }

    let unaffectedPatients = getUnaffectedPatients();
    let upsJson = [];
    for (let ups of unaffectedPatients) {
        upsJson.push(ups);
    }

    let cabinet = {};
    cabinet["name"] = "Cabinet Moulin-Tschofen";
    cabinet["address"] = "Saint-Brieuk";
    cabinet["nurses"] = nurseJson;
    cabinet["patients"] = patientJson;
    cabinet["unaffectedPatients"] = upsJson;

    res.json(cabinet);
    // res.json(getAllNurses().get("1").toJson());
});



app.get("/Init", (req, res) => {
    initDdbTest();
    res.end();
});

app.get("/addPatient", (req, res) => {
    // addPatientTo("01","002");
    addPatientTo("01", "001");
    addPatientTo("02", "001");
    addPatientTo("02", "002");
    res.end();
});





loadDatabase();

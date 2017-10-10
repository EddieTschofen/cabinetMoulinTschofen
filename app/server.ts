import "module-alias/register"; // Used to take into account path declaration for modules
// See declarations in package.json

import * as http from "http";                   // HTTP server
import * as https from "https";                 // HTTPS server
import * as express from "express";             // The application server
import * as bodyParser from "body-parser";      // Parse HTTP GET and POST variables
import * as path from "path";                   // Deal with system paths
import * as fs from "fs-extra";

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
        res.write(attr + " : " + req.query[attr] + "\n" );
      }
      // res.json(req.query);
      // res.end(str);
      res.end();
  }
});


app.post("/addPatient", (req, res) => {
    let error = 0;
    let errorMessage = "";
    if (req.body.name === undefined) {
      errorMessage += "\nVous devez spécifier name";
      error = 1;
    }
    if (req.body.forName === undefined) {
      errorMessage += "\nVous devez spécifier forName";
      error = 1;
    }
    if (req.body.socialSecurity === undefined) {
      errorMessage += "\nVous devez spécifier socialSecurity";
      error = 1;
    }
    /*if (req.body.patientSex === undefined) {
      errorMessage += "\nVous devez spécifier patientSex";
      error = 1;
    }
    else if (req.body.patientSex !== "M" || req.body.patientSex !== "F") {
      errorMessage += "\npatientSex doit etre egal à M ou F";
      error = 1;
    }
    if (req.body.birthday === undefined) {
      errorMessage += "\nVous devez spécifier birthday";
      error = 1;
    }*/
    if (req.body.adress === undefined) {
      errorMessage += "\nVous devez spécifier adress";
      error = 1;
    }
    if (error === 1) {
        res.status(400);
        res.send(errorMessage);
    }
    else {
        //ajouter patient
    }
});

app.get("/getNurse", (req, res) => {

});

app.post("/addOrUpdateNurse", (req, res) => {

});

app.post("/deleteNurse", (req, res) => {

});

app.get("/getPatient", (req, res) => {

});

app.post("/addOrUpdatePatient", (req, res) => {

});

app.post("/deletePatient", (req, res) => {

});


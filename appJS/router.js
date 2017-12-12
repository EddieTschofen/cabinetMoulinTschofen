"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Patient_1 = require("./class/Patient");
const Infirmier_1 = require("./class/Infirmier");
// import {InfirmierJSON} from "./class/InfirmierJSON";
function getRouterPatientRestApi() {
    let express = require("express");
    // let Papp = express();
    let Papp = new express.Router();
    Papp.get("/getPatient", (req, res) => {
        let patients = Patient_1.getAllPatients();
        for (let patient of patients.values()) {
            res.json(patient);
        }
        res.end();
    });
    Papp.get("/getPatient/:patientID", (req, res) => {
        let p = req.params.patientID;
        res.json(Patient_1.getAllPatients().get(p));
    });
    Papp.get("/getUnaffectedPatients", (req, res) => {
        let affectedPatients = [];
        for (let nurse of Infirmier_1.getAllNurses().values()) {
            affectedPatients.push(nurse.patientsSSN);
        }
        res.json(affectedPatients);
    });
    Papp.post("/addOrUpdatePatient", (req, res) => {
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
        if (req.body.pathology === undefined) {
            errorMessage += "\nVous devez spécifier la pathologie";
            error = 1;
        }
        if (error === 1) {
            errorMessage += "\n";
            res.status(400);
            res.send(errorMessage);
        }
        else {
            // si patient n'existe pas, l'ajouter
            if (Patient_1.getPatientFromSocial(req.body.socialSecurity) === undefined) {
                Patient_1.getNewPatient(req.body.name, req.body.forName, req.body.adress, req.body.socialSecurity, req.body.pathology);
            }
            else {
                Patient_1.updatePatient(req.body.socialSecurity, req.body.name, req.body.forName, req.body.adress, req.body.pathology);
            }
        }
        res.end();
    });
    Papp.post("/deletePatient", (req, res) => {
        if (req.body.socialSecurity === undefined) {
            res.status(400);
            res.send("Please enter security number");
        }
        else {
            // console.log(req.body.socialSecurity);
            Patient_1.deletePatient(req.body.socialSecurity);
        }
    });
    return Papp;
}
exports.getRouterPatientRestApi = getRouterPatientRestApi;
function getRouterNurseRestApi() {
    let express = require("express");
    // let Napp = express();
    let Napp = new express.Router();
    Napp.get("/getNurse", (req, res) => {
        let nurses = Infirmier_1.getAllNurses();
        for (let nurse of nurses.values()) {
            res.json(nurse);
        }
        res.end();
    });
    Napp.get("/getNurse/:nurseID", (req, res) => {
        let n = req.params.nurseID;
        res.json(Infirmier_1.getAllNurses().get(n));
    });
    Napp.post("/addOrUpdateNurse", (req, res) => {
        let error = 0;
        let errorMessage = "";
        if (req.body.id === undefined) {
            errorMessage += "\nVous devez spécifier id";
            error = 1;
        }
        if (req.body.name === undefined) {
            errorMessage += "\nVous devez spécifier name";
            error = 1;
        }
        if (req.body.forName === undefined) {
            errorMessage += "\nVous devez spécifier forName";
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
            errorMessage += "\n";
            res.status(400);
            res.send(errorMessage);
        }
        else {
            // si infirmier n'existe pas, l'ajouter
            if (Infirmier_1.getNurseFromID(req.body.id) === undefined) {
                Infirmier_1.getNewNurse(req.body.name, req.body.forName, req.body.adress, req.body.id);
            }
            else {
                Infirmier_1.updateNurse(req.body.id, req.body.name, req.body.forName, req.body.adress);
            }
        }
    });
    Napp.post("/deleteNurse", (req, res) => {
        if (req.body.id === undefined) {
            res.status(400);
            res.send("Please enter ID");
        }
        else {
            Infirmier_1.deleteNurses(req.body.id);
        }
    });
    return Napp;
}
exports.getRouterNurseRestApi = getRouterNurseRestApi;
function dumpJson(obj, res) {
    let out = "";
    for (let i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    out += "\n";
    res.write(out);
}

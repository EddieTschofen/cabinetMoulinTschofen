"use strict";
///<reference path="../../node_modules/@types/node/inspector.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const mongoose_1 = require("mongoose");
const Infirmier_1 = require("../class/Infirmier");
const Patient_1 = require("../class/Patient");
const patientSchema = new mongoose_1.Schema({
    socialSecurity: { type: String, unique: true },
    name: String,
    forName: String,
    adress: String
});
const patientModel = mongoose_1.model("patients", patientSchema);
const nurseSchema = new mongoose_1.Schema({
    nurseId: { type: String, unique: true },
    name: String,
    forName: String,
    // socialSecurity  : {type: String, unique: true},
    /*birthday        : String,*/
    adress: String
});
const nurseModel = mongoose_1.model("nurses", nurseSchema);
Patient_1.obsAddedPatient.subscribe(Patient => { AddPatientMongo(Patient); });
Patient_1.obsRemovedPatient.subscribe(Patient => { RemovePatientMongo(Patient); });
Infirmier_1.obsAddedInfirmier.subscribe(Infirmier => { AddNurseMongo(Infirmier); });
Infirmier_1.obsRemovedInfirmier.subscribe(Infirmier => { RemoveNurseMongo(Infirmier); });
function AddPatientMongo(p) {
    console.log("AddPatientMongo");
    connectToMongo();
    console.log(p);
    let mod = new patientModel({ socialSecurity: p.getSSN(), name: p.getNom(), forName: p.getPrenom(), adress: p.getAdresse() });
    mod.save(function (err, p) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log("Ajout Patient OK");
        }
    });
}
function RemovePatientMongo(p) {
    console.log("RemovePatientMongo : " + p.getSSN());
    connectToMongo();
    patientModel.remove({ socialSecurity: p.socialSecurityNumber.toString() }, function (err) {
        console.log(err);
    });
}
function AddNurseMongo(n) {
    console.log("AddNurseMongo");
    connectToMongo();
    console.log(n);
    let mod = new nurseModel({ nurseId: n.getId(), name: n.getNom(), forName: n.getPrenom(), adress: n.getAdresse() });
    mod.save(function (err, n) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log("Ajout Nurse OK");
        }
    });
}
function RemoveNurseMongo(n) {
    connectToMongo();
    console.log("RemoveNurseMongo : " + n.id);
    nurseModel.remove({ nurseId: n.id.toString() }, function (err) {
        console.log(err);
    });
}
function connectToMongo() {
    mongoose_1.connect("mongodb://127.0.0.1:27017/cabinet-medical", { useMongoClient: true }).then(() => { console.log("connection reussie"); }, (r) => { console.log("connection refusée : " + r); });
}
exports.connectToMongo = connectToMongo;
function loadDatabase() {
    connectToMongo();
    nurseModel.find(function (err, allNurses) {
        if (err)
            return console.error(err);
        // console.log(allNurses);
        allNurses.forEach(function (n) {
            Infirmier_1.nurseFromDatabase(n.name, n.forName, n.adress, n.nurseId);
        });
    });
    patientModel.find(function (err, allPatient) {
        if (err)
            return console.error(err);
        console.log(allPatient);
        allPatient.forEach(function (p) {
            Patient_1.patientFromDatabase(p.name, p.forName, p.adress, p.socialSecurity);
        });
    });
}
exports.loadDatabase = loadDatabase;

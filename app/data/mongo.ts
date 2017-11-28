///<reference path="../../node_modules/@types/node/inspector.d.ts"/>

import * as mongoose from "mongoose";
(<any>mongoose).Promise = Promise;

import {connect, model, Schema} from "mongoose";
import {nurseFromDatabase, obsAddedInfirmier, obsRemovedInfirmier} from "../class/Infirmier";
import {obsAddedPatient, obsRemovedPatient, patientFromDatabase} from "../class/Patient";

const patientSchema = new Schema({
    socialSecurity  : {type: String, unique: true},
    name            : String,
    forName         : String,
    adress          : String
});
const patientModel = model("patients", patientSchema);

const nurseSchema = new Schema({
    nurseId         : {type: String, unique: true},
    name            : String,
    forName         : String,
    // socialSecurity  : {type: String, unique: true},
    /*birthday        : String,*/
    adress          : String
});
const nurseModel  = model("nurses", nurseSchema);

obsAddedPatient.subscribe(
    Patient => {AddPatientMongo(Patient); }
);
obsRemovedPatient.subscribe(
    Patient => {RemovePatientMongo(Patient); }
);
obsAddedInfirmier.subscribe(
    Infirmier => {AddNurseMongo(Infirmier); }
);
obsRemovedInfirmier.subscribe(
    Infirmier => {RemoveNurseMongo(Infirmier); }
);

function AddPatientMongo(p): any {
    console.log("AddPatientMongo");
    connectToMongo();
    console.log(p);
    let mod = new patientModel({socialSecurity: p.getSSN(), name: p.getNom(), forName: p.getPrenom(), adress: p.getAdresse()});
    mod.save(function(err, p) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log("Ajout Patient OK");
        }
    });
}
function RemovePatientMongo(p): any {
    console.log("RemovePatientMongo : " + p.getSSN());
    connectToMongo();
    patientModel.remove(
        {socialSecurity: p.socialSecurityNumber.toString() },
        function (err) {
            console.log(err);
        });
}

function AddNurseMongo(n): any {
    console.log("AddNurseMongo");
    connectToMongo();
    console.log(n);
    let mod = new nurseModel({nurseId: n.getId(), name: n.getNom(), forName: n.getPrenom(), adress: n.getAdresse()});
    mod.save(function(err, n) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log("Ajout Nurse OK");
        }
    });
}
function RemoveNurseMongo(n): any {
    connectToMongo();
    console.log("RemoveNurseMongo : " + n.id);
    nurseModel.remove(
        {nurseId: n.id.toString() },
        function (err) {
            console.log(err);
         });
}



export function connectToMongo() {
    connect("mongodb://127.0.0.1:27017/cabinet-medical", {useMongoClient: true}).then(
        () => {console.log("connection reussie"); },
        (r) => {console.log("connection refusée : " + r); }
        );
}


export function loadDatabase() {
    connectToMongo();
    nurseModel.find(function (err, allNurses) {
        if (err) return console.error(err);
        // console.log(allNurses);
        allNurses.forEach(function(n){
            nurseFromDatabase(n.name, n.forName, n.adress, n.nurseId);
        });
    });
    patientModel.find(function (err, allPatient) {
        if (err) return console.error(err);
        console.log(allPatient);
        allPatient.forEach(function(p){
            patientFromDatabase(p.name, p.forName, p.adress, p.socialSecurity);
        });
    });

}

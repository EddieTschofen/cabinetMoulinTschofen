///<reference path="../../node_modules/@types/node/inspector.d.ts"/>

import * as mongoose from "mongoose";
(<any>mongoose).Promise = Promise;

import {connect, model, Schema} from "mongoose";
import {
    addPatientTo,
    emptyNurseMap, getNewNurse, nurseFromDatabase, obsAddedInfirmier,
    obsRemovedInfirmier
} from "../class/Infirmier";
import {emptyPatientMap, getNewPatient, obsAddedPatient, obsRemovedPatient,
    patientFromDatabase
} from "../class/Patient";


const patientSchema = new Schema({
    socialSecurity  : {type: String, unique: true},
    name            : String,
    forName         : String,
    adress          : String,
    pathology       : String
});
const patientModel = model("patients", patientSchema);

const nurseSchema = new Schema({
    nurseId         : {type: String, unique: true},
    name            : String,
    forName         : String,
    // socialSecurity  : {type: String, unique: true},
    /*birthday        : String,*/
    adress          : String,
    patientsSSN     : [String]
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
    // connectToMongo();
    console.log(p);
    let mod = new patientModel({socialSecurity: p.getSSN(), name: p.getNom(), forName: p.getPrenom(), adress: p.getAdresse(), pathology: p.pathology});
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
    // connectToMongo();
    patientModel.remove(
        {socialSecurity: p.socialSecurityNumber.toString() },
        function (err) {
            console.log(err);
        });
}

function AddNurseMongo(n): any {
    console.log("AddNurseMongo");
    // connectToMongo();
    console.log(n);
    let mod = new nurseModel({nurseId: n.getId(), name: n.getNom(), forName: n.getPrenom(), adress: n.getAdresse(), patientsSSN: n.getPatientsSSN()});
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
    // connectToMongo();
    console.log("RemoveNurseMongo : " + n.id);
    nurseModel.remove(
        {nurseId: n.id.toString() },
        function (err) {
            console.log("suppression err : " + err);
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
            // TODO : remplir patients
        });
    });
    patientModel.find(function (err, allPatient) {
        if (err) return console.error(err);
        // console.log(allPatient);
        allPatient.forEach(function(p){
            patientFromDatabase(p.name,p.forName,p.adress,p.socialSecurity, p.pathology);
        });
    });
}

export function initDdbTest() {
    // connectToMongo();

    mongoose.connection.collections["nurses"].drop( function(err) {
        console.log("collection dropped");
    });
    mongoose.connection.collections["patients"].drop( function(err) {
        console.log("collection dropped");
    });
    // nurseModel.remove({}, function(err) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log("Empty nurses");
    //         }
    //     }
    // );
    // patientModel.remove({}, function(err) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log("Empty patients");
    //         }
    //     }
    // );

    emptyNurseMap();
    emptyPatientMap();

    getNewNurse("Tschoo", "Eddie", "Grenoble", "01");
    getNewNurse("Mouls", "Alex", "Grenoble", "02");

    getNewPatient("De Niro", "Robert", "LA", "001", "Gangster");
    getNewPatient("Nicholson", "Jack", "LA", "002", "Fou");

    addPatientTo("01", "001");
    addPatientTo("02", "001");
    addPatientTo("02", "002");
}

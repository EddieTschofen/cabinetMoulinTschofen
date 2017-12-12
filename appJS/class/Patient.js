"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Personne_1 = require("./Personne");
const Subject_1 = require("rxjs/Subject");
class Patient extends Personne_1.Personne {
    constructor(nom, prenom, adresse, socialSecurityNumber, pathology) {
        super(nom, prenom, adresse);
        this.socialSecurityNumber = socialSecurityNumber;
        this.pathology = pathology;
    }
    getSSN() {
        return this.socialSecurityNumber;
    }
    getPathology() {
        return this.pathology;
    }
    update(nom, prenom, adresse, pathology) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.pathology = pathology;
    }
    toJson() {
        return Object.assign({}, super.toJson(), { socialSecurityNumber: this.getSSN(), pathology: this.getPathology() });
    }
}
const mapPatients = new Map();
function getNewPatient(nom, prenom, adresse, socialSecurityNumber, pathology) {
    const P = new Patient(nom, prenom, adresse, socialSecurityNumber, pathology);
    mapPatients.set(P.getSSN(), P);
    subjectAddPatient.next(P);
    return P;
}
exports.getNewPatient = getNewPatient;
function patientFromDatabase(nom, prenom, adresse, socialSecurityNumber, pathology) {
    const P = new Patient(nom, prenom, adresse, socialSecurityNumber, pathology);
    mapPatients.set(P.getSSN(), P);
    return P;
}
exports.patientFromDatabase = patientFromDatabase;
function getPatientFromSocial(SSN) {
    return mapPatients.get(SSN);
}
exports.getPatientFromSocial = getPatientFromSocial;
function getAllPatients() {
    return mapPatients;
}
exports.getAllPatients = getAllPatients;
function deletePatient(SSN) {
    let P = getPatientFromSocial(SSN);
    console.log(P);
    subjectRemovedPatient.next(P);
    mapPatients.delete(SSN);
}
exports.deletePatient = deletePatient;
function updatePatient(SSN, nom, prenom, adresse, pathology) {
    let P = getPatientFromSocial(SSN);
    subjectRemovedPatient.next(P);
    P.update(nom, prenom, adresse, pathology);
    subjectAddPatient.next(P);
}
exports.updatePatient = updatePatient;
function emptyPatientMap() {
    mapPatients.clear();
}
exports.emptyPatientMap = emptyPatientMap;
const subjectAddPatient = new Subject_1.Subject();
const subjectRemovedPatient = new Subject_1.Subject();
exports.obsAddedPatient = subjectAddPatient.asObservable();
exports.obsRemovedPatient = subjectRemovedPatient.asObservable();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Personne_1 = require("./Personne");
class Patient extends Personne_1.Personne {
    constructor(nom, prenom, adresse, socialSecurityNumber) {
        super(nom, prenom, adresse);
        this.socialSecurityNumber = socialSecurityNumber;
    }
    getSSN() {
        return this.socialSecurityNumber;
    }
    update(nom, prenom, adresse) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
    }
    toJson() {
        return Object.assign({}, super.toJson(), { socialSecurityNumber: this.getSSN() });
    }
}
const mapPatients = new Map();
function getNewPatient(nom, prenom, adresse, socialSecurityNumber) {
    const P = new Patient(nom, prenom, adresse, socialSecurityNumber);
    mapPatients.set(P.getSSN(), P);
    return P;
}
exports.getNewPatient = getNewPatient;
function getPatientFromSocial(SSN) {
    return mapPatients.get(SSN);
}
exports.getPatientFromSocial = getPatientFromSocial;
function getAllPatients() {
    return mapPatients;
}
exports.getAllPatients = getAllPatients;
function deletePatient(SSN) {
    mapPatients.delete(SSN);
}
exports.deletePatient = deletePatient;
function updatePatient(SSN, nom, prenom, adresse) {
    let P = getPatientFromSocial(SSN);
    P.update(nom, prenom, adresse);
}
exports.updatePatient = updatePatient;

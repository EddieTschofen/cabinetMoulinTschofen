"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Personne_1 = require("./Personne");
class Infirmier extends Personne_1.Personne {
    constructor(nom, prenom, adresse, id) {
        super(nom, prenom, adresse);
        this.id = id;
    }
    getId() {
        return this.id;
    }
    update(nom, prenom, adresse) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
    }
    toJson() {
        return Object.assign({}, super.toJson(), { id: this.getId() });
    }
}
const mapNurses = new Map();
function getNewNurse(nom, prenom, adresse, id) {
    const N = new Infirmier(nom, prenom, adresse, id);
    mapNurses.set(N.getId(), N);
    return N;
}
exports.getNewNurse = getNewNurse;
function getNurseFromID(id) {
    return mapNurses.get(id);
}
exports.getNurseFromID = getNurseFromID;
function getAllNurses() {
    return mapNurses;
}
exports.getAllNurses = getAllNurses;
function deleteNurses(ID) {
    mapNurses.delete(ID);
}
exports.deleteNurses = deleteNurses;
function updatePatient(ID, nom, prenom, adresse) {
    let N = getNurseFromID(ID);
    N.update(nom, prenom, adresse);
}
exports.updatePatient = updatePatient;

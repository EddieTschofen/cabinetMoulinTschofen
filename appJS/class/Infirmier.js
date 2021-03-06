"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Personne_1 = require("./Personne");
const Subject_1 = require("rxjs/Subject");
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
    subjectAddInfirmier.next(N);
    return N;
}
exports.getNewNurse = getNewNurse;
function nurseFromDatabase(nom, prenom, adresse, id) {
    const N = new Infirmier(nom, prenom, adresse, id);
    mapNurses.set(N.getId(), N);
    return N;
}
exports.nurseFromDatabase = nurseFromDatabase;
function getNurseFromID(id) {
    return mapNurses.get(id);
}
exports.getNurseFromID = getNurseFromID;
function getAllNurses() {
    return mapNurses;
}
exports.getAllNurses = getAllNurses;
function deleteNurses(ID) {
    let N = getNurseFromID(ID);
    subjectRemovedInfirmier.next(N);
    mapNurses.delete(ID);
}
exports.deleteNurses = deleteNurses;
function updateNurse(ID, nom, prenom, adresse) {
    let N = getNurseFromID(ID);
    subjectRemovedInfirmier.next(N);
    N.update(nom, prenom, adresse);
    subjectAddInfirmier.next(N);
}
exports.updateNurse = updateNurse;
const subjectAddInfirmier = new Subject_1.Subject();
const subjectRemovedInfirmier = new Subject_1.Subject();
exports.obsAddedInfirmier = subjectAddInfirmier.asObservable();
exports.obsRemovedInfirmier = subjectRemovedInfirmier.asObservable();

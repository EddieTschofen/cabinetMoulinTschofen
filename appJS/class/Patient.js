"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Personne_1 = require("./Personne");
class Patient extends Personne_1.Personne {
    constructor(nom, prenom, adresse, id, socialSecurityNumber) {
        super(nom, prenom, adresse);
        this.id = id;
        this.socialSecurityNumber = socialSecurityNumber;
    }
    getId() {
        return this.id;
    }
    getSSN() {
        return this.socialSecurityNumber;
    }
    toJson() {
        return Object.assign({}, super.toJson(), { id: this.getId(), socialSecurityNumber: this.getSSN() });
    }
}

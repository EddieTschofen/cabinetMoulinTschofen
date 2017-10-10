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
    toJson() {
        return Object.assign({}, super.toJson(), { id: this.getId() });
    }
}

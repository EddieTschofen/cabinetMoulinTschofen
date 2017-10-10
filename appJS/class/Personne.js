"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Personne {
    constructor(nom, prenom, adresse) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
    }
    getNom() {
        return this.nom;
    }
    getPrenom() {
        return this.prenom;
    }
    getAdresse() {
        return this.adresse;
    }
    toJson() {
        return {
            nom: this.getNom(),
            prenom: this.getPrenom(),
            adresse: this.getAdresse()
        };
    }
}
exports.Personne = Personne;

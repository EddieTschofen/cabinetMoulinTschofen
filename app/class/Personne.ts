import {PersonneJSON} from "./PersonneJSON";

export abstract class Personne {
  nom: string;
  prenom: string;
  adresse: string;

  constructor(nom: string, prenom: string, adresse: string) {
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

  toJson(): PersonneJSON {
    return {
      nom: this.getNom(),
      prenom: this.getPrenom(),
      adresse : this.getAdresse()
    };
  }
}

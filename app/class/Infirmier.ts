import{Personne} from "./Personne";
import {InfirmierJSON} from "./InfirmierJSON";


class Infirmier extends Personne {
  id: string;
  constructor(nom: string, prenom: string, adresse: string, id: string) {
    super(nom, prenom, adresse);
    this.id = id;
  }

  getId() {
    return this.id;
  }

  update(nom: string, prenom: string, adresse: string) {
    this.nom = nom;
    this.prenom = prenom;
    this.adresse = adresse;
  }

  toJson(): InfirmierJSON {
    return Object.assign({}, super.toJson(),{ id : this.getId()});
  }
}

const mapNurses = new Map<string, Infirmier>();

export function getNewNurse(nom: string, prenom: string, adresse: string, id: string): Infirmier {
    const N = new Infirmier(nom, prenom, adresse, id);
    mapNurses.set(N.getId(), N);
    return N;
}
export function getNurseFromID(id: string): Infirmier {
    return mapNurses.get(id);
}
export function getAllNurses(): Map<string, Infirmier> {
    return mapNurses;
}
export function deleteNurses(ID: string) {
    mapNurses.delete(ID);
}
export function updatePatient(ID: string, nom: string, prenom: string, adresse: string) {
    let N = getNurseFromID(ID);
    N.update(nom, prenom, adresse);
}

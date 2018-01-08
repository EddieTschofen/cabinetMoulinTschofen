import{Personne} from "./Personne";
import {InfirmierJSON} from "./InfirmierJSON";


import {Subject} from "rxjs/Subject";

class Infirmier extends Personne {
  id: string;
  patientsSSN: string[];

  constructor(nom: string, prenom: string, adresse: string, id: string) {
    super(nom, prenom, adresse);
    this.id = id;
    this.patientsSSN = [];
  }

  getId() {
    return this.id;
  }

  getPatientsSSN() {
      return this.patientsSSN;
  }

  addPatient(SSN: string) {
      this.patientsSSN.push(SSN);
  }

  removePatient(id: number) {
      this.patientsSSN.splice(id, 1);
  }

  update(nom: string, prenom: string, adresse: string) {
    this.nom = nom;
    this.prenom = prenom;
    this.adresse = adresse;
  }

  toJson(): InfirmierJSON {
    return Object.assign({}, super.toJson(), { id : this.getId(), patients : this.getPatientsSSN()});
  }
}

const mapNurses = new Map<string, Infirmier>();

export function getNewNurse(nom: string, prenom: string, adresse: string, id: string): Infirmier {
    const N = new Infirmier(nom, prenom, adresse, id);
    mapNurses.set(N.getId(), N);
    subjectAddInfirmier.next(N);
    return N;
}
export function nurseFromDatabase(nom: string, prenom: string, adresse: string, id: string): Infirmier {
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
    let N = getNurseFromID(ID);
    subjectRemovedInfirmier.next(N);

    mapNurses.delete(ID);
}
export function updateNurse(ID: string, nom: string, prenom: string, adresse: string) {
    let N = getNurseFromID(ID);
    subjectRemovedInfirmier.next(N);
    N.update(nom, prenom, adresse);
    subjectAddInfirmier.next(N);
}
export function emptyNurseMap() {
    mapNurses.clear();
}
export function addPatientTo(nurseId: string, SSN: string) {
    let N = getNurseFromID(nurseId);
    console.log("ajout de " + SSN + " pour " + nurseId);
    N.addPatient(SSN);
    subjectUpdateInfirmier.next(N);
    // subjectAddInfirmier.next(N);
}
export function removePatientTo(nurseId: string, SSN: string) {
    console.log("eee");
    let N = getNurseFromID(nurseId);
    for (let i = 0; i < N.getPatientsSSN().length; i++) {
        if (N.getPatientsSSN()[i] === SSN ) {
            N.removePatient(i);
        }
    }
    console.log("Supression de " + SSN + " pour " + nurseId);
    subjectUpdateInfirmier.next(N);
    // subjectAddInfirmier.next(N);
}
export function addPatientToFromDatabase(nurseId: string, SSN: string){
    let N = getNurseFromID(nurseId);
    console.log("ajout de " + SSN + " pour " + nurseId);
    N.addPatient(SSN);
}



const subjectAddInfirmier = new Subject<Infirmier>();
const subjectRemovedInfirmier = new Subject<Infirmier>();
const subjectUpdateInfirmier = new Subject<Infirmier>();

export let obsAddedInfirmier = subjectAddInfirmier.asObservable();
export let obsRemovedInfirmier = subjectRemovedInfirmier.asObservable();
export let obsUpdateInfirmier = subjectUpdateInfirmier.asObservable();
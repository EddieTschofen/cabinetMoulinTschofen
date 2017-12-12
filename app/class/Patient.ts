import{Personne} from "./Personne";
import {PatientJSON} from "./PatientJSON";

import {Subject} from "rxjs/Subject";

class Patient extends Personne {

    socialSecurityNumber: string;
    pathology: string;

    constructor(nom: string, prenom: string, adresse: string, socialSecurityNumber: string, pathology: string) {
        super(nom, prenom, adresse);
        this.socialSecurityNumber = socialSecurityNumber;
        this.pathology = pathology;
    }

    getSSN(): string {
        return this.socialSecurityNumber;
    }

    getPathology(): string {
        return this.pathology;
    }

    update(nom: string, prenom: string, adresse: string, pathology: string) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.pathology = pathology;
    }

    toJson(): PatientJSON {
        return Object.assign({}, super.toJson(), {socialSecurityNumber : this.getSSN(), pathology : this.getPathology()});
    }

}

const mapPatients = new Map<string, Patient>();

export function getNewPatient(nom: string, prenom: string, adresse: string, socialSecurityNumber: string, pathology: string): Patient {
    const P = new Patient(nom, prenom, adresse, socialSecurityNumber, pathology);
    mapPatients.set(P.getSSN(), P);
    subjectAddPatient.next(P);
    return P;
}
export function patientFromDatabase(nom: string, prenom: string, adresse: string, socialSecurityNumber: string, pathology: string): Patient {
    const P = new Patient(nom, prenom, adresse, socialSecurityNumber, pathology);
    mapPatients.set(P.getSSN(), P);
    return P;
}
export function getPatientFromSocial(SSN: string): Patient {
    return mapPatients.get(SSN);
}
export function getAllPatients(): Map<string, Patient> {
    return mapPatients;
}
export function deletePatient(SSN: string) {
    let P = getPatientFromSocial(SSN);
    console.log(P);
    subjectRemovedPatient.next(P);

    mapPatients.delete(SSN);
}
export function updatePatient(SSN: string, nom: string, prenom: string, adresse: string, pathology: string) {
    let P = getPatientFromSocial(SSN);
    subjectRemovedPatient.next(P);
    P.update(nom, prenom, adresse, pathology);
    subjectAddPatient.next(P);
}
export function emptyPatientMap(){
    mapPatients.clear();
}

const subjectAddPatient = new Subject<Patient>();
const subjectRemovedPatient = new Subject<Patient>();

export let obsAddedPatient = subjectAddPatient.asObservable();
export let obsRemovedPatient = subjectRemovedPatient.asObservable();
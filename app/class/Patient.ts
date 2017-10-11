import{Personne} from "./Personne";
import {PatientJSON} from "./PatientJSON";


class Patient extends Personne {

    socialSecurityNumber: string;

    constructor(nom: string, prenom: string, adresse: string, socialSecurityNumber: string) {
        super(nom, prenom, adresse);
        this.socialSecurityNumber = socialSecurityNumber;
    }

    getSSN(): string {
        return this.socialSecurityNumber;
    }

    update(nom: string, prenom: string, adresse: string) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
    }

    toJson(): PatientJSON {
        return Object.assign({}, super.toJson(), {socialSecurityNumber : this.getSSN()});
    }

}

const mapPatients = new Map<string, Patient>();

export function getNewPatient(nom: string, prenom: string, adresse: string, socialSecurityNumber: string): Patient {
    const P = new Patient(nom, prenom, adresse, socialSecurityNumber);
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
    mapPatients.delete(SSN);
}
export function updatePatient(SSN: string, nom: string, prenom: string, adresse: string) {
    let P = getPatientFromSocial(SSN);
    P.update(nom, prenom, adresse);
}

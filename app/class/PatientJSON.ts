import {PersonneJSON} from "./PersonneJSON";

export interface PatientJSON extends PersonneJSON {
    nom: string;
    prenom: string;
    adresse: string;
    socialSecurityNumber: string;
    pathology: string;
}
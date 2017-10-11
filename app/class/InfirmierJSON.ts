import {PersonneJSON} from "./PersonneJSON";

export interface InfirmierJSON extends PersonneJSON {
    nom: string;
    prenom: string;
    adresse: string;
    id: string;
}
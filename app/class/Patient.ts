import{Personne} from "./Personne";
import {InfirmierJSON} from "./InfirmierJSON";


class Patient extends Personne {

    id: number;
    socialSecurityNumber: number;

    constructor(nom: string, prenom: string, adresse: string, id: number, socialSecurityNumber: number) {
        super(nom, prenom, adresse);
        this.id = id;
        this.socialSecurityNumber = socialSecurityNumber;
    }

    getId(): number {
        return this.id;
    }

    getSSN(): number {
        return this.socialSecurityNumber;
    }

    toJson(): InfirmierJSON {
        return Object.assign({}, super.toJson(), { id : this.getId(), socialSecurityNumber : this.getSSN()});
    }

}

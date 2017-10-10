import{Personne} from "./Personne";
import {InfirmierJSON} from "./InfirmierJSON";


class Infirmier extends Personne {
  id: number;
  constructor(nom: string, prenom: string, adresse: string, id: number) {
    super(nom, prenom, adresse);
    this.id = id;
  }

  getId(){
    return this.id;
  }

  toJson(): InfirmierJSON {
    return Object.assign({}, super.toJson(),{ id : this.getId()});
  }
}

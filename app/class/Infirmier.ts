import{Personne,PersonneJSON} from "./Personne.ts";
export interface InfirmierJSON extends PersonneJSON{

}

class Infirmier extends Personne{
  id : number;
  constructor(nom : string,prenom : string,adresse : string,id : number){
    super(nom,prenom,adresse);
    this.id = id;
  }

  getId(){
    return this.id;
  }

  toJson():InfirmierJSON{
    return Object.assign({},super.toJSON(),{id : this.getId()})
  }
}

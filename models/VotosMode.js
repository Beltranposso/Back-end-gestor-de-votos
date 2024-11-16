import db from "../database/db.js";
import { DataTypes} from "sequelize";


const Votos = db.define('votes',{
    id_Option: {type: DataTypes.STRING},
    id_voter:{type: DataTypes.STRING},
    Voto:{type:DataTypes.STRING},
    id_card:{type:DataTypes.STRING}


}) 

export default Votos 
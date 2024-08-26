import db from "../database/db.js";
import { DataTypes} from "sequelize";


const Asamblea = db.define('asambleas',{
    Title: {type: DataTypes.STRING},
    Color:{type: DataTypes.STRING},
    Userid:{type:DataTypes.STRING}

}) 

export default Asamblea
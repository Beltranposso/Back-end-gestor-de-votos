
import db from "../database/db.js";
import {DataTypes} from "sequelize";


const  Option = db.define('options',{
    id_pregunta:{type: DataTypes.STRING},
    opcion:{type: DataTypes.STRING}
   
})

export default Option 
 

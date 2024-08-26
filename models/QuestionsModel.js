
import db from "../database/db.js";
import {DataTypes} from "sequelize";


const  Question = db.define('preguntas',{
    id_title:{type: DataTypes.STRING},
    Pregunta:{type: DataTypes.STRING}

})

export default Question
 

 
  
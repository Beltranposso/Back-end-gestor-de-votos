
import db from "../database/db.js";
import {DataTypes} from "sequelize";


const  Question = db.define('questions',{
    Pregunta:{type: DataTypes.STRING}

})

export default Question
 

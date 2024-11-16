import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definir el modelo de Preguntas (QuestionsModel)
const Question = db.define('pregunta', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true 
    },
    id_card: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Pregunta: { type: DataTypes.STRING }
});

export default Question;

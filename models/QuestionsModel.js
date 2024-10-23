import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definir el modelo de Preguntas (QuestionsModel)
const Question = db.define('pregunta', {
    id_card: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Pregunta: { type: DataTypes.STRING }
});

export default Question;

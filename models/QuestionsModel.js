const db = require("../database/db.js");
const { DataTypes } = require("sequelize");

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
    Pregunta: { 
        type: DataTypes.STRING 
    }
});

module.exports = Question;

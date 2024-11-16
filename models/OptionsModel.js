const db = require('../database/db.js');
const { DataTypes } = require('sequelize');
const QuestionsModel = require('./QuestionsModel.js'); // Importar el modelo de Preguntas

// Definir el modelo de Opciones (OptionsModel)
const Option = db.define('opciones', {
    id_pregunta: {
        type: DataTypes.INTEGER, // Cambiar a INTEGER si es el tipo de dato correcto en tu base de datos
        references: {
            model: 'pregunta', // Nombre de la tabla relacionada en base de datos
            key: 'id',
        },
    },
    opcion: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'opciones', // Nombre de la tabla real en la base de datos
    timestamps: false, // Desactivar createdAt y updatedAt si no se utilizan
});

// Exportar el modelo
module.exports = Option;

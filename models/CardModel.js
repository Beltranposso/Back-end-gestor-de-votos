const db = require('../database/db.js');
const { DataTypes } = require('sequelize');

const Asamblea = db.define('asambleas', {
    id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true,
    },
    Title: { type: DataTypes.STRING }, // Si el título es obligatorio
    Color: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    UserId: { type: DataTypes.INTEGER },
    Estado: { type: DataTypes.ENUM('Programada', 'Activa', 'Finalizada') },
    horaInicio: { type: DataTypes.STRING },
    horaExpiracion: { type: DataTypes.STRING },
    Descripcion: { type: DataTypes.STRING },
    FechaInicio: { type: DataTypes.STRING},
    Condominio: { type: DataTypes.STRING},
    createdAt: { type: DataTypes.DATE },
   
});

// Exportar el modelo
module.exports = Asamblea;

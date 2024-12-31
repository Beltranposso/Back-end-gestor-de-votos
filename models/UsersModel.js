const db = require ("../database/db.js") 
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); 


 const Tabla = db.define('app_usuarios',{

    id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(), // Generar un UUID por defecto
        allowNull: true,
        primaryKey: true
    },
    Nombre: {type: DataTypes.STRING},
    Apellido: {type: DataTypes.STRING},
    Correo:{type: DataTypes.STRING},
    Cedula:{type: DataTypes.INTEGER},
    Contraseña:{type: DataTypes.STRING},
    cargo:{type: DataTypes.INTEGER},
    id_card:{type: DataTypes.STRING},
    Asistencia:{type: DataTypes.ENUM('Presente','Ausente')},
   
})


module.exports = Tabla 
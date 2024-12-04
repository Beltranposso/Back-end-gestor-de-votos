const db = require ("../database/db.js") 

const { DataTypes } = require("sequelize");

 const Tabla = db.define('usuarios',{
    Nombre: {type: DataTypes.STRING},
    Apellido: {type: DataTypes.STRING},
    Cedula:{type: DataTypes.INTEGER},
    quorum:{type: DataTypes.FLOAT},
    EstadoVoto:{type: DataTypes.ENUM('Si','No')},
    id_card:{type: DataTypes.STRING},
    Apto:{type: DataTypes.STRING},
    Correo:{type: DataTypes.STRING},
    Cargo:{type: DataTypes.INTEGER},
    Asistencia:{type: DataTypes.ENUM('Presente','Ausente')},

})


module.exports = Tabla
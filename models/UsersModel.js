const db = require ("../database/db.js") 

const { DataTypes } = require("sequelize");

 const Tabla = db.define('app_usuarios',{
    Nombre: {type: DataTypes.STRING},
    Apellido: {type: DataTypes.STRING},
    Correo:{type: DataTypes.STRING},
    Cedula:{type: DataTypes.INTEGER},
    Contraseña:{type: DataTypes.STRING},
    id_cargo:{type: DataTypes.INTEGER},
    poder:{type: DataTypes.FLOAT},
})


module.exports = Tabla
import db from "../database/db.js";

import {DataTypes} from "sequelize";

 const Tabla = db.define('app_usuarios',{
    Nombre: {type: DataTypes.STRING},
    Apellido: {type: DataTypes.STRING},
    Correo:{type: DataTypes.STRING},
    Cedula:{type: DataTypes.INTEGER},
    Contraseña:{type: DataTypes.STRING},
    id_cargo:{type: DataTypes.INTEGER},
    poder:{type: DataTypes.FLOAT},
})



export default Tabla
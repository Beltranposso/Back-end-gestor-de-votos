import db from "../database/db.js";

import {DataTypes} from "sequelize";

 const  Tabla = db.define('app_usuarios',{
    Nombre: {type: DataTypes.STRING},
    Apellido: {type: DataTypes.STRING},
    Correo:{type: DataTypes.STRING},
    Cedula:{type: DataTypes.STRING},
    Contraseña:{type: DataTypes.STRING},
})



export default Tabla
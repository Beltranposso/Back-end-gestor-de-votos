const db = require ("../database/db.js") 
const { v4: uuidv4 } = require('uuid'); //
const { DataTypes } = require("sequelize");

 const Propuesta = db.define('propuestas',{
    id: {
        type: DataTypes.STRING, 
         // Generar UUID automáticamente
        primaryKey: true
    },
    id_card:{type: DataTypes.STRING},
    title:{type: DataTypes.STRING},
    options:{type: DataTypes.JSON}
})

 
module.exports = Propuesta  
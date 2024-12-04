
const db = require ("../database/db.js") 

const { DataTypes } = require("sequelize");


const Votos = db.define('votes',{
    id_Option: {type: DataTypes.STRING},
    id_voter:{type: DataTypes.STRING},
    Voto:{type:DataTypes.STRING},
    id_card:{type:DataTypes.STRING}


}) 


module.exports = Votos 
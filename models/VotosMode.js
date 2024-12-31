
const db = require ("../database/db.js") 

const { DataTypes } = require("sequelize");


const Votos = db.define('votes',{

    id_option: {type: DataTypes.INTEGER,allowNull: true},
    id_voter:{type: DataTypes.INTEGER},
    voto:{type:DataTypes.STRING},
    id_card:{type:DataTypes.STRING}, 
    id_question: {
        type: DataTypes.STRING,
    }


}) 


module.exports = Votos  
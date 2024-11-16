
const db = require ("../database/db.js") 

const { DataTypes } = require("sequelize");

const  Question = db.define('questions',{
    Pregunta:{type: DataTypes.STRING}

})

module.exports =  Question; 
 

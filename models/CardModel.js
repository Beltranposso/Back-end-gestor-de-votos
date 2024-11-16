import db from "../database/db.js";
import { DataTypes } from "sequelize";

const Asamblea = db.define('asambleas', {
    id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true
    },
    Title: { type: DataTypes.STRING, allowNull: false }, // Si el título es obligatorio
    Color: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING },
    UserId: { type: DataTypes.STRING },
    Estado: { type: DataTypes.STRING },

    
});

// Exportar el modelo
export default Asamblea;
 
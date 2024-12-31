const db = require("../database/db.js");
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); // Importar la función para generar UUID

const Tabla = db.define('usuarios', {
    id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(), // Generar un UUID por defecto
        allowNull: true
    },
    Nombre: { type: DataTypes.STRING },
    Apellido: { type: DataTypes.STRING },
    Cedula: { type: DataTypes.INTEGER , primaryKey: true},
    quorum: { type: DataTypes.FLOAT },
    EstadoVoto: { type: DataTypes.ENUM('Si', 'No') },
    id_card: { type: DataTypes.STRING },
    Apto: { type: DataTypes.STRING },
    Correo: { type: DataTypes.STRING },
    Cargo: { type: DataTypes.INTEGER },
    Asistencia: { type: DataTypes.ENUM('Presente', 'Ausente') },
    HoraDellegada: { type: DataTypes.STRING },
    PoderesDelegados: { type: DataTypes.INTEGER },
});

module.exports = Tabla;

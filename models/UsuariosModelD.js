const db = require("../database/db.js");
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); // Importar la función para generar UUID

const Tabla = db.define('usuarios', {
    id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(), // Generar un UUID por defecto
        allowNull: true,
        primaryKey: true
    },
    Nombre: { 
        type: DataTypes.STRING,
    },
    Apellido: { 
        type: DataTypes.STRING,
    },
    Cedula: { 
        type: DataTypes.INTEGER,
    },
    quorum: { 
        type: DataTypes.FLOAT 
    },
    EstadoVoto: { 
        type: DataTypes.ENUM('Si', 'No') 
    },
    id_card: { 
        type: DataTypes.STRING 
    },
    Apto: { 
        type: DataTypes.STRING 
    },
    Correo: { 
        type: DataTypes.STRING 
    },
    Cargo: { 
        type: DataTypes.INTEGER 
    },
    Asistencia: { 
        type: DataTypes.ENUM('Presente', 'Ausente') 
    },
    HoraDellegada: { 
        type: DataTypes.STRING 
    },
    RegisterQuorum: { 
        type: DataTypes.FLOAT 
    },
    PoderesDelegados: { 
        type: DataTypes.INTEGER 
    },
    esRepresentado: { 
        type: DataTypes.ENUM('P', 'No') 
    },
    Representante: { 
        type: DataTypes.STRING, 
        allowNull: true // Permitimos que se inicialice en null temporalmente
    },
    esApoderado: {
        type: DataTypes.ENUM('No', 'Si')
    }
    ,Apoderados:{
        type: DataTypes.JSON
    }
}, {
    hooks: {
        beforeCreate: (user) => {
            // Establecer "Representante" como combinación de "Nombre" y "Apellido"
            user.Representante = `${user.Nombre} ${user.Apellido}`;
            // Asegurar que "RegisterQuorum" sea igual a "quorum"
            user.RegisterQuorum = user.quorum;
        },
        beforeUpdate: (user) => {
            // Actualizar "Representante" si cambian "Nombre" o "Apellido"
            user.Representante = `${user.Nombre} ${user.Apellido}`;
            // Asegurar que "RegisterQuorum" sea igual a "quorum" al actualizar
            user.RegisterQuorum = user.quorum;
        }
    }
}); 

module.exports = Tabla;

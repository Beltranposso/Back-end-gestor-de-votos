const { Sequelize } = require('sequelize');

const db = new Sequelize('app_users', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 50,        // Máximo de conexiones simultáneas en el pool
        min: 10,        // Mínimo de conexiones para mantener activas
        acquire: 30000, // Tiempo máximo para obtener una conexión antes de error (ms)
        idle: 10000,    // Tiempo en que una conexión inactiva se cierra (ms)
        evict: 15000,   // Tiempo para limpiar conexiones no usadas (ms)
      },  
      
      retry: {
        max: 3, // Intentar reintentar hasta 3 veces si hay errores de conexión
      }
});

module.exports = db;
 
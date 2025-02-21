const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "localhost",  // Cambia esto si Redis está en otro servidor
    port: 6379,         // Puerto por defecto de Redis (antes estaba incorrecto)
    reconnectStrategy: (retries) => Math.min(retries * 50, 500) // Reintentos progresivos
  }
});

// Manejadores de eventos para errores y conexión

client.on("connect", () => console.log("✅ Conectado a Redis"));
client.on("reconnecting", () => console.log("♻️ Reconectando a Redis..."));

// Conectar a Redis
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("❌ No se pudo conectar a Redis:", err.message);
  }
})();


module.exports = client;
   
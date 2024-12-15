const VotosMode = require("../models/VotosMode.js");

const ModelUser = require('../models/UsuariosModelD.js');
const { Votos, UsuariosDefinitive } = require("../models/asociations.js");
const jwt = require('jsonwebtoken'); 
// Trae todos los votos
exports.getAllVotos = async (req, res) => {
    try {
        const Votos = await VotosMode.findAll();
        res.json(Votos);

    } catch (error) {
        console.log("Hubo un error al traer los votos de los usuarios");
        res.json({
            "message": error.message
        });
    }
};

// Registra un voto
exports.RegisterVote = async (req, res) => {
    try {
        // Verificamos si hay un token en las cookies
        const token = req.cookies.Token;
        if (!token) {
            return res.status(401).json({ message: "No se ha encontrado el token de autenticación" });
        }

        // Decodificamos el token para obtener los datos
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Asegúrate de que SECRET_KEY esté correctamente configurado

        // Extraemos la cédula del token
        const id_voter = parseInt(decoded.Cedula); // Cambia 'Cedula' por el nombre exacto en tu token si es diferente

        // Añadimos la cédula en el campo id_voter
        req.body.id_voter = id_voter;

        // Validación opcional: Verificar si ya existe un voto para el mismo votante
        const votoExistente = await VotosMode.findOne({
            where: { id_voter }
        });
        if (votoExistente) {
            return res.status(409).json({ message: "El votante ya ha registrado un voto" }); // 409 Conflict
        }

        // Creamos el voto
        const nuevoVoto = await VotosMode.create(req.body);

        // Actualizamos el estado del voto en el modelo de usuario
        const usuario = await ModelUser.findOne({
            where: { Cedula: id_voter }
        });

        if (usuario) {
            // Actualizamos el campo EstadoVoto a 'Si'
            await usuario.update({ EstadoVoto: 'Si' });
        }

        // Respuesta en caso de éxito
        return res.status(201).json({
            message: "El registro fue exitoso",
            voto: nuevoVoto, // Incluye el objeto creado si es relevante
        });
    } catch (error) {
        // En caso de error, logueamos y respondemos con el mensaje de error
        console.error("Error al registrar el voto:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};
 

 // Asegúrate de importar el modelo de Usuarios

 exports.getvoto = async (req, res) => {
    try {
        const votos = await Votos.findAll({
            where: { id_card: req.params.id_card },
            include: [
                {
                    model: UsuariosDefinitive,
                    as: 'usuario', // Usar el alias definido en la relación
                    attributes: ['Nombre'], // Seleccionar los campos que necesitas
                }
            ]
        });
        res.json(votos);
    } catch (error) {
        console.log("Hubo un error al traer los votos");
        res.json({
            "message": error.message
        });
    }
};


// Obtiene los votos por id de opción
exports.getVotosByid = async (req, res) => {
    try {
        const votos = await VotosMode.findAll({
            where: { id_Option: req.params.id_Option }
        });
        res.json(votos);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};



exports.checkVoter = async (req, res) => {
    try {
        // Obtener el token desde las cookies (ajusta esto si usas otro mecanismo de almacenamiento)
        const token = req.cookies.Token;

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        // Decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Usa tu clave secreta aquí
        const cedula = parseInt(decoded.Cedula); // Ajusta según el campo que almacene la cédula

        // Verificar si la cédula existe en el campo "id_voter"
        const votoExistente = await VotosMode.findOne({
            where: { id_voter: cedula }
        });

        if (votoExistente) {
            // Si existe, devolver false
            return res.json({ messege: 'El usuario ya ha votado tumba la casa mami', exists: false });
        } else {
            // Si no existe, devolver true
            return res.json({messege: 'El usuario no ha votado', exists: true });
        }
 
    } catch (error) {
        console.error('Error en la verificación del votante:', error);
        res.status(500).json({ message: error.message });
    }
};

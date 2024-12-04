const Cardmodel = require('../models/CardModel.js');
const { Op } = require('sequelize');


// Obtener todas las tarjetas
exports.getAllCards = async (req, res) => {
    try {
        const card = await Cardmodel.findAll();
        res.json(card);
    } catch (error) {
        console.log("Hubo un error al traer los datos");
        res.json({
            "message": error.message
        });
    }
};

// Obtener una tarjeta por su ID
exports.getCard = async (req, res) => {
    try {
        // Validar el parámetro id (debe ser una cadena no vacía)
        const id = req.params.id;
        if (!id || typeof id !== "string" || id.trim() === "") {
            return res.status(400).json({
                message: "El parámetro 'id' es inválido o no se proporcionó."
            });
        }

        // Buscar la tarjeta por id
        const card = await Cardmodel.findOne({
            where: { id }
        });

        // Si no se encuentra la tarjeta, responder con un mensaje claro
        if (!card) {
            return res.status(404).json({
                message: `No se encontró ninguna tarjeta con el ID: ${id}`
            });
        }

        // Respuesta exitosa
        res.status(200).json(card);
    } catch (error) {
        // Log detallado del error para depuración
        console.error("Error al traer la tarjeta por su ID:", error.message);

        // Respuesta en caso de error del servidor
        res.status(500).json({
            message: "Hubo un error al traer la tarjeta por su ID.",
            error: error.message
        });
    }
};

// Crear una nueva tarjeta
exports.createCard = async (req, res) => {
    try {
        // Validar los datos del cuerpo de la solicitud
        const { Title,Descripcion,UserId } = req.body;
        
        if (!Title || !Descripcion || !UserId) {
            return res.status(400).json({
                message: "Todos los campos osn obligatorios deben ser completados.",
            });
        }

        // Crear el registro en la base de datos
        const newCard = await Cardmodel.create(req.body);
 
        res.status(201).json({ 
            message: "El registro de la votación fue exitoso",
            data: newCard, // Devolver el nuevo registro creado
        });
    } catch (error) {
        // Detectar errores específicos (ejemplo: validación del modelo)
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Error de validación de datos.",
                details: error.errors, // Más información sobre el error
            });
        }

        // Error interno del servidor
        res.status(500).json({
            message: "Hubo un error al registrar la asamblea.",
            error:"diablo loco pno llego  ana", // Información para depuración
        });
    }
};
// Eliminar una tarjeta por su ID
exports.DeleteCard = async (req, res) => {
    try {
        await Cardmodel.destroy({
            where: { id: req.params.id }
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Obtener tarjetas por cédula
exports.getCardsByCedula = async (req, res) => {
    try {
        const cards = await Cardmodel.findAll({
            where: { cedula: req.params.cedula }
        });
        res.json(cards);
    } catch (error) {
        console.log("Hubo un error al traer las cards por cédula");
        res.json({
            "message": error.message
        });
    }
};

// Actualizar el estado de una tarjeta
exports.updateCard = async (req, res) => { 
    try {               
        // Actualiza solo el campo 'estado'
        await Cardmodel.update(
            { Estado: req.body.Estado }, // Solo actualiza el campo 'estado'
            {
                where: { id: req.params.id }
            }
        );
        res.json({            
            "message": "El estado se actualizó correctamente"
        });
    } catch (error) {
        res.status(500).json({ // Es una buena práctica agregar un código de estado HTTP
            "message": error.message
        });
    }
};
